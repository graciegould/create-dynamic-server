# create-dynamic-server

A CLI tool for quickly setting up a new project with the **[Super Dynamic Server](https://github.com/graciegould/super-dynamic-server)** template. It clones the template from a GitHub repository, installs dependencies, and prepares the project for development with hot-reloading and SCSS support.

# Create project with `npx create-dynamic-server`

You can use this tool directly with `npx`:

```
npx create-dynamic-server my-app
```
or cd into folder you want to use and run
```
npx create-dynamic-server .
```
- Installs dependencies automatically.
- Sets up a new project without Git history.
- untracks .env file

## Features

- [**Express**](https://www.npmjs.com/package/express) for serving the application.
- [**Webpack**](https://www.npmjs.com/package/webpack) for bundling JavaScript and CSS.
- [**Gulp**](https://www.npmjs.com/package/gulp) for defining tasks for automating development and build workflows
- [**Hot Module Replacement**](https://webpack.js.org/concepts/hot-module-replacement/) with Webpack for speedy development — live updates browser on edits to JS, SCSS, or CSS files in the `/src` directory without requiring a full page reload.
- [**Nodemon**](https://www.npmjs.com/package/nodemon) to automatically restart the Express server when changes are detected in the `server.js` file or anything in the `/api` directory — ensuring that the server stays up to date during development without manual restarts.
- **Support for Vanilla JavaScript, React, and other preferred JS frameworks frameworks**
- Easy Node module imports on the front end

### Configure the environment you wish to run through the env by commenting out the one you wish to use — default is development

(note: if you cloned this repo directory w/o using npx, add your `.env` to the `.gitignore`

```bash
# DEV CONFIG 
NODE_ENV='development'
PORT=3000
HOST='localhost'

# PROD CONFIG
# NODE_ENV='production'
# PORT=80
# HOST='0.0.0.0'
```

### To Start the Development Server

```bash
npm start
```

or 

```bash
npm run start:dev 
```

### To generate a production-ready build, run:

```bash
npm run build
```

### To build & run production you can uncomment prod configs and uncomment dev configs in your .env

```bash
# DEV CONFIG 
# NODE_ENV='development'
# PORT=3000
# HOST='localhost'

# PROD CONFIG
NODE_ENV='production'
PORT=80
HOST='0.0.0.0'
```

and run 

```bash
npm start
```

or 

```bash
npm start:prod
```

## Folder Structure

```bash
super-dynamic-server/ 
	├── config/ # Webpack configurations │ 
		├── dev.config.js # Development mode Webpack configuration 
		│── prod.config.js # Production mode Webpack configuration 
	├── dist/ # Build folder for production, do not delete files will be generated here in dev mode
	├── public/ # Static assets (images, fonts, etc.) │ 
	├── src/ # Application client side files 
	  ├── index.js # Main JavaScript entry point │ 
		├── App.js # Example React component (can be Vanilla JS) │ 
		├── css/ 
				├── main.css # compiled / minified of CSS from SCSS files
		├── scss/ 
				├── main.scss # File that gets compiled to main.css
	│ └── index.html # HTML template used by HtmlWebpackPlugin 
	├── gulpfile.js # Gulp tasks (SCSS compilation, clean, etc.) 
	├── server.js # server entry file
	└── package.json 
```

### Customization

### Changing Front-End Frameworks

You can easily swap out React for any other front-end framework (like Vue or Angular) by replacing the relevant dependencies and modifying `src/index.js` and `webpack.config.js` accordingly.

You can modify `src/index.js` for your preferred framework:

Using Vanilla JavaScript

```
import html from "./component.html";
document.body.innerHTML = html;
```

Using React

```
import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/main.css';

const App = () => <h1>Hello, React!</h1>;

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(<App />);

```

### Gulp Task Automation

The `gulpfile.js` includes several preconfigured tasks for SCSS compilation, cleaning the build directory, and more. Feel free to extend or modify it to suit your workflow.

---