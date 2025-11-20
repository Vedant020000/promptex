#!/usr/bin/env node

const path = require("path");
const fs = require("fs");

// Check if node_modules exists, if not, warn user
const nodeModulesPath = path.join(__dirname, "../node_modules");
if (!fs.existsSync(nodeModulesPath)) {
  console.error("\x1b[31m%s\x1b[0m", "Error: Dependencies not installed.");
  console.error('Please run "npm install" in the tool directory first.');
  process.exit(1);
}

// Start the server
require("../server.js");
