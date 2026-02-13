#!/usr/bin/env node

/**
 * Entry point for Phusion Passenger
 * This file redirects to the actual server in the server/ directory
 */

const path = require('path');

// Set up paths for the application
const serverPath = path.join(__dirname, '../server');
const rootPath = path.join(__dirname, '..');

// Ensure critical directories exist
const fs = require('fs');
const uploadsDir = path.join(serverPath, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set environment variables for paths if not already set
process.env.APP_ROOT = rootPath;
process.env.SERVER_ROOT = serverPath;

// Change working directory to server for relative path resolution
process.chdir(serverPath);

// Load the actual server
try {
  require(path.join(serverPath, 'index.js'));
} catch (error) {
  console.error('Fatal Error: Failed to load server', error);
  process.exit(1);
}
