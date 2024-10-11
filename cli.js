#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectName = process.argv[2];
if (!projectName) {
  console.error('Please specify the project directory:');
  console.log('  npx create-dynamic-server <project-directory>');
  process.exit(1);
}

const projectPath = path.resolve(process.cwd(), projectName);
const repoURL = 'https://github.com/graciegould/super-dynamic-server.git';

try {
  console.log(`Cloning repository into ${projectPath}...`);
  execSync(`git clone ${repoURL} "${projectPath}" --depth 1`);
  process.chdir(projectPath);
  fs.rmSync(path.join(projectPath, '.git'), { recursive: true, force: true });
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  console.log('Setup complete! To get started:');
  console.log(`  cd ${projectName}`);
  console.log('  npm start');
} catch (error) {
  console.error('An error occurred:', error.message);
  process.exit(1);
}
