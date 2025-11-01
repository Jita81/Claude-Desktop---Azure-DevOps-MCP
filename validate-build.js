#!/usr/bin/env node

/**
 * Build Validation Script
 * Tests what we can without running the full MCP server
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('='.repeat(80));
console.log('Azure DevOps Work Item MCP Server - Build Validation');
console.log('='.repeat(80));
console.log('');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passed++;
  } catch (error) {
    console.log(`❌ FAIL: ${name}`);
    console.log(`   Error: ${error.message}`);
    failed++;
  }
}

// Test 1: Check dist folder exists
test('Dist folder exists', () => {
  if (!existsSync(join(__dirname, 'dist'))) {
    throw new Error('dist folder not found');
  }
});

// Test 2: Check main entry point exists
test('Main entry point (dist/index.js) exists', () => {
  if (!existsSync(join(__dirname, 'dist', 'index.js'))) {
    throw new Error('dist/index.js not found');
  }
});

// Test 3: Check tools file exists
test('Tools module (dist/tools.js) exists', () => {
  if (!existsSync(join(__dirname, 'dist', 'tools.js'))) {
    throw new Error('dist/tools.js not found');
  }
});

// Test 4: Check work-items module exists
test('Work items module (dist/tools/work-items.js) exists', () => {
  if (!existsSync(join(__dirname, 'dist', 'tools', 'work-items.js'))) {
    throw new Error('dist/tools/work-items.js not found');
  }
});

// Test 5: Check resources module exists
test('Resources module (dist/resources.js) exists', () => {
  if (!existsSync(join(__dirname, 'dist', 'resources.js'))) {
    throw new Error('dist/resources.js not found');
  }
});

// Test 6: Check prompts module exists
test('Prompts module (dist/prompts.js) exists', () => {
  if (!existsSync(join(__dirname, 'dist', 'prompts.js'))) {
    throw new Error('dist/prompts.js not found');
  }
});

// Test 7: Check core tools module exists
test('Core tools module (dist/tools/core.js) exists', () => {
  if (!existsSync(join(__dirname, 'dist', 'tools', 'core.js'))) {
    throw new Error('dist/tools/core.js not found');
  }
});

// Test 8: Validate package.json
test('Package.json is valid JSON', () => {
  const pkg = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf8'));
  if (!pkg.name) throw new Error('Package name missing');
  if (!pkg.version) throw new Error('Package version missing');
  if (pkg.name !== '@azure-devops/mcp-workitems') {
    throw new Error(`Expected name @azure-devops/mcp-workitems, got ${pkg.name}`);
  }
  if (pkg.version !== '3.0.0') {
    throw new Error(`Expected version 3.0.0, got ${pkg.version}`);
  }
});

// Test 9: Check no non-work-item tools
test('Removed non-work-item tool files', () => {
  const badFiles = [
    'dist/tools/pipelines.js',
    'dist/tools/repositories.js',
    'dist/tools/wiki.js',
    'dist/tools/search.js',
    'dist/tools/test-plans.js',
    'dist/tools/advanced-security.js'
  ];
  
  const existing = badFiles.filter(f => existsSync(join(__dirname, f)));
  if (existing.length > 0) {
    throw new Error(`Found removed files: ${existing.join(', ')}`);
  }
});

// Test 10: Check documentation exists
test('README.md exists and mentions work items', () => {
  const readme = readFileSync(join(__dirname, 'README.md'), 'utf8');
  if (!readme.includes('Work Item')) {
    throw new Error('README does not mention Work Item');
  }
  if (!readme.includes('Node.js 20')) {
    throw new Error('README does not mention Node.js 20 requirement');
  }
});

// Test 11: Test configuration file
test('Test configuration file is valid', () => {
  const config = JSON.parse(readFileSync(join(__dirname, 'test-config.json'), 'utf8'));
  if (!config.mcpServers) throw new Error('Missing mcpServers');
  if (!config.mcpServers['ado-workitems-test']) {
    throw new Error('Missing ado-workitems-test server config');
  }
});

// Test 12: Testing guide exists
// Testing guide was consolidated into production test documentation
// test('Testing guide documentation exists', () => {
//   if (!existsSync(join(__dirname, 'TESTING_GUIDE.md'))) {
//     throw new Error('TESTING_GUIDE.md not found');
//   }
// });

// Test 13: Check shebang in index.js
test('Index.js has correct shebang', () => {
  const index = readFileSync(join(__dirname, 'dist', 'index.js'), 'utf8');
  if (!index.startsWith('#!/usr/bin/env node')) {
    throw new Error('Missing or incorrect shebang');
  }
});

console.log('');
console.log('='.repeat(80));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(80));

if (failed > 0) {
  process.exit(1);
}

