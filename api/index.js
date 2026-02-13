#!/usr/bin/env node

/**
 * Entry point for Phusion Passenger
 * This file redirects to the actual server in the server/ directory
 * and handles module resolution properly
 */

const path = require('path');
const fs = require('fs');
const Module = require('module');

// Set up paths for the application
const serverPath = path.join(__dirname, '../server');
const rootPath = path.join(__dirname, '..');
const serverNodeModules = path.join(serverPath, 'node_modules');

// Ensure critical directories exist
const uploadsDir = path.join(serverPath, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set NODE_PATH to include server's node_modules
process.env.NODE_PATH = serverNodeModules;
Module._initPaths();

// Set environment variables for paths
process.env.APP_ROOT = rootPath;
process.env.SERVER_ROOT = serverPath;

// Change working directory to server for relative path resolution
process.chdir(serverPath);

// Add server's node_modules to module search paths
const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function(request, parent, isMain) {
  try {
    return originalResolveFilename.apply(this, arguments);
  } catch (e) {
    // Try resolving from server's node_modules
    if (!request.startsWith('.') && !request.startsWith('/')) {
      const modulePath = path.join(serverNodeModules, request);
      if (fs.existsSync(modulePath)) {
        return originalResolveFilename.call(this, modulePath, parent, isMain);
      }
    }
    throw e;
  }
};

// Load the actual server
try {
  require(path.join(serverPath, 'index.js'));
} catch (error) {
  console.error('Fatal Error: Failed to load server', error);
  console.error('Server Path:', serverPath);
  console.error('Node Modules Path:', serverNodeModules);
  console.error('Node Modules Exists:', fs.existsSync(serverNodeModules));
  console.error('Stack:', error.stack);
  process.exit(1);
}
