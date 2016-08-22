Angular 2 Electron Boilerplate
=====================

An easy to use boilerplate for Angular 2 applications. This includes all of the necesssary features for using Angular 2 as of the RC5 update, including forms, NgModule and an easy to use development flow.

Install
=======

Installing this boilerplate is extremely simple!

`git clone https://github.com/c4wrd/angular2-electron-boilerplate`

`cd angular2-electron-boilerplate`

`npm install`

That's it! You are now ready for development.

Development Tools
=================

This boilerplate utilizes a few packages to ensure an automated and easy to use workflow with Angular 2. Here is a list of them and their purposes: 
- TypeScript: The language used in this project's development
- tsconfig.json: Configuration for our TypeScript code.
- typings.json: Typings used within the code, such as core-js
- Gulp: Gulp is used as the primary build, development and packaging system. Generally you may not need to run any of the registered Gulp commands, instead you can just invoke straight as an npm script (i.e. `npm run build`).
- Bower: Bower is used primarily for frontend CSS frameworks and may be used however you like. Currently it is only used for the Bootstrap used within the application, but this can easily be removed.

You can find the source of the application in *src*.

Structure
---------

All source files for your application should be listed under *src*. These files will be copied to the *dist* folder on build, and all *.ts* files will automatically be transpiled to JavaScript. Sass files are also transpiled if placed in the src/assets/scss folder.

Building
--------

To build your application, you can simply run `npm run build`. This will copy the files to the dist directory, but will not start the Electron application.

You can run your application with `npm run start`
