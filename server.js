#!/usr/bin/env node

/**
 * Railway HTTP Server for Azure DevOps MCP
 * Wraps the MCP server with a simple HTTP interface
 */

import { spawn } from 'child_process';
import http from 'http';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 3000;

console.log('Starting Azure DevOps MCP Server on Railway');
console.log(`Port: ${PORT}`);

// Health check endpoint
const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-ADO-PAT, X-ADO-ORG');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Health check endpoint
  if (req.url === '/health' || req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      service: 'Azure DevOps MCP Server',
      version: '3.0.0',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production'
    }));
    return;
  }

  // MCP endpoint
  if (req.url === '/mcp') {
    const pat = req.headers['x-ado-pat'];
    const org = req.headers['x-ado-org'];

    if (!pat || !org) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'Missing X-ADO-PAT or X-ADO-ORG header',
        message: 'Please provide X-ADO-PAT and X-ADO-ORG headers in your request'
      }));
      return;
    }

    // Validate organization name
    if (!/^[a-zA-Z0-9-_]+$/.test(org)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'Invalid organization name',
        message: 'Organization name can only contain letters, numbers, hyphens, and underscores'
      }));
      return;
    }

    // Set up SSE
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    // Start MCP server
    const serverPath = resolve(__dirname, 'dist/index.js');
    const mcpServer = spawn('node', [
      serverPath,
      org,
      '--authentication', 'pat'
    ], {
      env: {
        ...process.env,
        ADO_PAT: pat,
        NODE_ENV: 'production'
      },
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let isConnected = true;

    // Forward stdout to SSE
    mcpServer.stdout.on('data', (data) => {
      if (isConnected) {
        try {
          res.write(`data: ${data.toString()}\n\n`);
        } catch (err) {
          console.error('Error writing to response:', err);
          isConnected = false;
        }
      }
    });

    // Log errors
    mcpServer.stderr.on('data', (data) => {
      console.error('MCP Server stderr:', data.toString());
    });

    // Handle errors
    mcpServer.on('error', (error) => {
      console.error('Failed to start MCP server:', error);
      if (isConnected) {
        res.write(`event: error\ndata: ${JSON.stringify({ error: 'Server error' })}\n\n`);
        res.end();
      }
    });

    // Handle close
    mcpServer.on('close', (code) => {
      console.log('MCP server closed with code', code);
      if (isConnected) {
        res.end();
      }
    });

    // Clean up on disconnect
    req.on('close', () => {
      console.log('Client disconnected');
      isConnected = false;
      mcpServer.kill('SIGTERM');
      setTimeout(() => {
        if (!mcpServer.killed) {
          mcpServer.kill('SIGKILL');
        }
      }, 5000);
    });

    // Forward request body to MCP server
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        if (body) {
          mcpServer.stdin.write(body);
          mcpServer.stdin.end();
        }
      });
    }

    return;
  }

  // 404 for other routes
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    error: 'Not found',
    message: 'Available endpoints: /health, /mcp'
  }));
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Health: http://localhost:${PORT}/health`);
  console.log(`MCP: http://localhost:${PORT}/mcp`);
});

// Handle shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

