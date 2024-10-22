#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const clc = require('cli-color'); 
const { setInterval, clearInterval } = require('timers');
const REPO_URL = 'https://github.com/graciegould/super-dynamic-server.git';
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const checkExistingNodeProject = (projectPath) => {
  return fs.existsSync(path.join(projectPath, 'package.json'));
};

const promptUser = (question) => {
    return new Promise((resolve) => {
    rl.question(clc.yellow(question), (answer) => {
      resolve(answer.toLowerCase());
    });
  });
};

const startSpinner = (message) => {
  const spinnerChars = ['|', '/', '-', '\\'];
  let i = 0;

  const interval = setInterval(() => {
    process.stdout.write('\r' + message + clc.cyan(spinnerChars[i++ % spinnerChars.length]) + ' ');
  }, 100);

  return () => {
    clearInterval(interval);
    process.stdout.write('\r' + message + clc.green('✔') + '\n'); 
  };
};

let projectName = process.argv[2] || '.';
let projectPath = '';

if (projectName === '.') {
  projectPath = process.cwd();
  projectName = path.basename(projectPath);
} else {
  projectPath = path.resolve(process.cwd(), projectName);
}

(async () => {
  try {
    if (checkExistingNodeProject(projectPath)) {
      const answer = await promptUser('A Node.js project already exists in this directory. Do you want to overwrite it? (y/n): ');

      if (answer !== 'y') {
        console.log(clc.red('Project creation aborted.'));
        process.exit(0);
      }
    }
    const stopCloneSpinner = startSpinner(`🍋Cloning repository into ${clc.green(projectPath)}🍋...`);
    execSync(`git clone ${REPO_URL} "${projectPath}" --depth 1`);
    stopCloneSpinner();  
    process.chdir(projectPath);
    const stopRemoveSpinner = startSpinner('Removing .git folder...');
    fs.rmSync(path.join(projectPath, '.git'), { recursive: true, force: true });
    stopRemoveSpinner();
    
    // Ensure .env is untracked
    const gitignorePath = path.join(projectPath, '.gitignore');
    if (!fs.existsSync(gitignorePath)) {
      fs.writeFileSync(gitignorePath, '.env\n');
    } else {
      const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
      if (!gitignoreContent.includes('.env')) {
        fs.appendFileSync(gitignorePath, '\n.env\n');
      }
    }

    // Reinitialize Git repository and make initial commit
    const stopInitSpinner = startSpinner('Reinitializing Git repository...');
    execSync('git init', { stdio: 'ignore' });
    execSync('git add .', { stdio: 'ignore' });
    execSync('git commit -m "Initial commit"', { stdio: 'ignore' });
    stopInitSpinner();

    const stopInstallSpinner = startSpinner('Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    stopInstallSpinner();
    console.log(clc.cyan('\nSetup complete! To get started:'));
    console.log(clc.yellow(`  cd ${projectName}`));
    console.log(clc.yellow('  npm start'));
  } catch (error) {
    console.error(clc.red('An error occurred:', error.message));
    process.exit(1);
  } finally {
    rl.close();
  }
})();