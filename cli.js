#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const cp = require('console-palette');
const readline = require('readline');
const { setInterval, clearInterval } = require('timers');
const REPO_URL = 'https://github.com/graciegould/super-dynamic-server.git';
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Check if a package.json exists in the directory, indicating a Node.js project
const checkExistingNodeProject = (projectPath) => {
  return fs.existsSync(path.join(projectPath, 'package.json'));
};

// Check if the directory exists and is not empty
const checkIfDirectoryExistsAndNotEmpty = (directoryPath) => {
  return fs.existsSync(directoryPath) && fs.readdirSync(directoryPath).length > 0;
};

// Prompt the user for input
const promptUser = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.toLowerCase());
    });
  });
};

// Spinner for showing progress
const startSpinner = (message) => {
  const spinnerChars = ['|', '/', '-', '\\'];
  let i = 0;

  const interval = setInterval(() => {
    process.stdout.write('\r' + message + spinnerChars[i++ % spinnerChars.length] + ' ');
  }, 100);

  return () => {
    clearInterval(interval);
    process.stdout.write('\r' + message + '✔\n');
  };
};

// Function to clear contents of a directory without removing the directory itself
const clearDirectory = (directoryPath) => {
  fs.readdirSync(directoryPath).forEach(file => {
    const filePath = path.join(directoryPath, file);
    if (fs.lstatSync(filePath).isDirectory()) {
      fs.rmSync(filePath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(filePath);
    }
  });
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
    // Check if the directory is not empty or has an existing Node.js project
    if (checkIfDirectoryExistsAndNotEmpty(projectPath) || checkExistingNodeProject(projectPath)) {
      const answer = await promptUser(cp.custom(
        `Directory ${projectPath} already exists and is not empty. Do you want to clear the directory and continue? (y/n): `,
        { color: "yellow", style: "bold" }
      ));

      if (answer !== 'y') {
        console.log(cp.red('Project creation aborted.'));
        process.exit(0);
      }

      // Clear the contents of the directory but don't remove the directory itself
      const stopClearSpinner = startSpinner(`Clearing directory contents of ${projectPath}...`);
      clearDirectory(projectPath);
      stopClearSpinner();
    }

    const stopCloneSpinner = startSpinner(cp.brightMagenta(`Cloning repository into ${projectPath}...`));
    execSync(`git clone ${REPO_URL} "${projectPath}" --depth 1`, { stdio: 'inherit' });
    stopCloneSpinner();

    const stopRemoveSpinner = startSpinner(cp.cyan('Removing .git folder...'));
    fs.rmSync(path.join(projectPath, '.git'), { recursive: true, force: true });
    stopRemoveSpinner();

    // Ensure .env is untracked in .gitignore
    const gitignorePath = path.join(projectPath, '.gitignore');
    if (!fs.existsSync(gitignorePath)) {
      fs.writeFileSync(gitignorePath, '.env\n');
    } else {
      const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
      if (!gitignoreContent.includes('.env')) {
        fs.appendFileSync(gitignorePath, '\n.env\n');
      }
    }

    // Reinitialize Git repository and make an initial commit
    const stopInitSpinner = startSpinner(cp.cyan('Reinitializing Git repository...'));
    execSync('git init', { stdio: 'ignore' });
    execSync('git add .', { stdio: 'ignore' });
    execSync('git commit -m "Initial commit"', { stdio: 'ignore' });
    stopInitSpinner();

    const stopInstallSpinner = startSpinner(cp.cyan('Installing dependencies...'));
    execSync('npm install', { stdio: 'inherit' });
    stopInstallSpinner();

    console.log(cp.brightGreen('\nSetup complete! To get started:'));
    console.log(cp.custom(`  cd ${projectName}`, { color: "yellow", style: "bold" }));
    console.log(cp.custom('  npm start', { color: "yellow", style: "bold" }));
    console.log(cp.blue('For more information, check out the README.md file.'));

  } catch (error) {
    console.error(cp.red(`An error occurred: ${error.message}`));
    process.exit(1);
  } finally {
    rl.close();
  }
})();
