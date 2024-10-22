# create-dynamic-server

A CLI tool for quickly setting up a new project with the **[Super Dynamic Server](https://github.com/graciegould/super-dynamic-server)** template. It clones the template from a GitHub repository, installs dependencies, and prepares the project for development with hot-reloading and SCSS support.

# Create project with `npx create-dynamic-server`

You can use this tool directly with `npx`:

```
npx create-dynamic-server my-app
```

- Installs dependencies automatically.
- Sets up a fresh project without Git history.

## Features

- [**Express**](https://www.npmjs.com/package/express) for serving the application.
- [**Webpack**](https://www.npmjs.com/package/webpack) for bundling JavaScript and CSS.
- [**Gulp**](https://www.npmjs.com/package/gulp) for defining tasks for automating development and build workflows
- [**Hot Module Replacement**](https://webpack.js.org/concepts/hot-module-replacement/) with Webpack for speedy development — live updates browser on edits to JS, SCSS, or CSS files in the `/src` directory without requiring a full page reload.
- [**Nodemon**](https://www.npmjs.com/package/nodemon) to automatically restart the Express server when changes are detected in the `server.js` file or anything in the `/api` directory — ensuring that the server stays up to date during development without manual restarts.
- **Support for Vanilla JavaScript, React, and other preferred JS frameworks frameworks**
- Easy Node module imports on the front end

