// Vercel serverless function wrapper for MCP server
// This enables remote access to the Azure DevOps MCP server

import { spawn } from 'child_process';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function handler(req, res) {
  // Enable CORS for MCP clients
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-ADO-PAT, X-ADO-ORG');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Extract PAT and organization from headers
  const pat = req.headers['x-ado-pat'];
  const org = req.headers['x-ado-org'];

  if (!pat || !org) {
    return res.status(401).json({ 
      error: 'Missing X-ADO-PAT or X-ADO-ORG header',
      message: 'Please provide X-ADO-PAT and X-ADO-ORG headers in your MCP client configuration'
    });
  }

  // Validate organization name (basic sanitization)
  if (!/^[a-zA-Z0-9-_]+$/.test(org)) {
    return res.status(400).json({
      error: 'Invalid organization name',
      message: 'Organization name can only contain letters, numbers, hyphens, and underscores'
    });
  }

  // Set up SSE response for MCP communication
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    // Start MCP server as child process
    const serverPath = resolve(__dirname, '../dist/index.js');
    const server = spawn('node', [
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

    // Forward MCP server output to SSE stream
    server.stdout.on('data', (data) => {
      if (isConnected) {
        try {
          res.write(`data: ${data.toString()}\n\n`);
        } catch (err) {
          console.error('Error writing to response:', err);
          isConnected = false;
        }
      }
    });

    // Log errors but don't send to client (might contain sensitive info)
    server.stderr.on('data', (data) => {
      console.error('MCP Server stderr:', data.toString());
    });

    // Handle server errors
    server.on('error', (error) => {
      console.error('Failed to start MCP server:', error);
      if (isConnected) {
        res.write(`event: error\ndata: ${JSON.stringify({ error: 'Server error occurred' })}\n\n`);
        res.end();
      }
    });

    // Handle server exit
    server.on('close', (code) => {
      console.log('MCP server process exited with code', code);
      if (isConnected) {
        res.end();
      }
    });

    // Clean up on client disconnect
    req.on('close', () => {
      console.log('Client disconnected, cleaning up MCP server');
      isConnected = false;
      server.kill('SIGTERM');
      
      // Force kill after 5 seconds if still running
      setTimeout(() => {
        if (!server.killed) {
          server.kill('SIGKILL');
        }
      }, 5000);
    });

    // Forward client input to server stdin
    if (req.method === 'POST' && req.body) {
      server.stdin.write(JSON.stringify(req.body));
      server.stdin.end();
    }

  } catch (error) {
    console.error('Error in MCP handler:', error);
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to start MCP server'
      });
    }
  }
}

// Vercel configuration
export const config = {
  api: {
    bodyParser: true,
    responseLimit: false,
  },
};

