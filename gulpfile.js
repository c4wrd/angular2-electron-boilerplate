"use strict";

var gulp = require('gulp'),
    del = require('del'),
    electron = require('electron-connect').server.create(),
    symdest = require('gulp-symdest'),
    sass = require('gulp-sass'),
    shell = require('gulp-shell'),
    config = require("./project-config"),
    runSeq = require('run-sequence'),
    newer = require('gulp-newer'),
    ts = require('gulp-typescript'),
    merge = require('merge2'),
    tsProject = ts.createProject({
        declaration: true, noExternalResolve: false, 
        experimentalDecorators: true, moduleResolution: 'node'});

/**
 * Cleans our distribution folder
 */
gulp.task('electron:clean', function () {
    return del('dist/**/*', {force: true});
});

/**
 * Copies the following into the distribution folder:
 *  1. Node modules that are needed for distribution
 *  2. Bower packages needed for distribution
 *  3. Any other remaining files in our `src`
 *     directory
 */
gulp.task('electron:copy', () => {
    var fs_setup = [
        { // copy assets from our source to distribution
            from: ['./src/**/*', '!./src/**/*.scss', '!./src/**/*.ts'],
            to: './dist'
        }
    ];

    config.VENDOR_FILES.forEach((item) => {
        let SOURCE = item.source;
        let FILES = SOURCE.concat("/").concat(item.files);

        fs_setup.push({
            from: `node_modules/${FILES}`,
            to: `./dist/assets/vendor/${SOURCE}`
        })
    });


    if ( config.BOWER_PACKAGES ) {
        config.BOWER_PACKAGES.forEach((item) => {
            let SOURCE = item.source;
            let FILES = SOURCE.concat("/").concat(item.files);

            fs_setup.push({
                from: `./bower_components/${FILES}`,
                to: `./dist/assets/bower/${SOURCE}`
            })
        });
    }

    return fs_setup.map((setup) => {
        return gulp.src(setup.from).pipe(gulp.dest(setup.to));
    });
});

/**
 * Copies the following into the distribution folder:
 *  1. NOT ANY Node modules! Use copy if you need them.
 *  2. NOT ANY Bower packages! Use copy if you need them.
 *  3. Any other remaining files in our `src`
 *     directory
 */
gulp.task('electron:copy-newer-non-TS-sources', () => {
    var fs_setup = [
        { // copy assets from our source to distribution
            from: ['./src/**/*', '!./src/**/*.scss', '!./src/**/*.ts'],
            to: './dist'
        }
    ];

    return fs_setup.map((setup) => {
        return gulp.src(setup.from)
            .pipe(newer({ map: (fn) => { return fn.replace('src', 'dist').replace('.ts', '.js'); } }))
            .pipe(gulp.dest(setup.to));
    });
});

/**
 * Transpiles our Sass classes into CSS and
 * places it in the matching folder hierarchy in
 * the distribution folder.
 */
gulp.task('electron:transpile:sass', function () {
    gulp.src('./src/**/*.scss')
        .pipe(newer({ map: (fn) => { return fn.replace('src', 'dist').replace('.scss', '.css'); } }))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist'));
});

/**
 * Watches our Sass files for changes
 * and transpiles edited files and places
 * them in the distribution folder.
 */
gulp.task("sass:watch", function () {
    gulp.watch('./src/**/*.scss', ['electron:transpile:sass']);
});

/**
 * Transpiles TypeScript to JavaScript
 */
gulp.task('electron:transpile:ts', shell.task(['tsc']));

/**
 * Incrementally Transpiles new or changed TypeScript files to JavaScript files
 */
gulp.task('electron:transpile:ts-newer', function() {
    let tsResult = gulp.src(['src/**/*.ts', 'typings/**/*.ts'])
        .pipe(newer({ map: (fn) => { return fn.replace('src', 'dist').replace('.ts', '.js'); } }))
        .pipe(ts(tsProject));
    return merge([ // Merge the two output streams, so this task is finished when the IO of both operations are done.
        tsResult.dts.pipe(gulp.dest('./typings')),
        tsResult.js.pipe(gulp.dest('./dist'))
    ]);
});

/**
 * Builds the OSX application and places it in our
 * 'packages' folder
 */
gulp.task('electron:build:osx', function () {
    gulp.src(['dist/**/*'])
        .pipe(electron({
            version: '1.3.3',
            platform: 'darwin'
        }))
        .pipe(symdest('packages/osx'));
});

/**
 * Builds the Linux application and places it in our
 * 'packages' folder
 */
gulp.task('electron:build:linux', function () {
    gulp.src(['dist/**/*'])
        .pipe(electron({
            version: '1.3.3',
            platform: 'linux'
        }))
        .pipe(symdest('packages/linux'));
});

/**
 * Builds the Windows executable file and places it in our
 * 'packages' folder
 */
gulp.task('electron:build:win', function () {
    gulp.src(['dist/**/*'])
        .pipe(electron({
            version: '1.3.3',
            platform: 'win32'
        }))
        .pipe(symdest('packages/win'));
});

/**
 * Umbrella task for executing our build
 */
gulp.task('electron:build', function (done) {
    return runSeq('electron:clean', 'electron:copy', 'electron:transpile:sass', 'electron:transpile:ts', done);
});

/**
 * Task for packing our application for OS distribution
 */
gulp.task('electron:package', (done) => {
    return runSeq('build',
        ['electron:build:win', 'electron:build:osx', 'electron:build:linux'], done);
});

gulp.task('build', ['electron:build']);

gulp.task('start', function () {
  // Start browser process
    electron.start(['dist']);
});

gulp.task('electron:reload', function () {
  // Start browser process
    electron.reload();
});
gulp.task('reload', ['electron:reload']);

gulp.task('livesourcesync', function () {
  // Start browser process
  electron.start(['dist']);

  // Restart browser process (basically restart the whole thing)
  //  gulp.watch('src/**', electron.restart);

  // Reload renderer process
  gulp.watch(['src/**.ts'], () => {
      runSeq('electron:transpile:ts-newer', 'reload');
  });
  gulp.watch(['src/**', '!src/**.ts'], () => {
      runSeq('electron:copy', 'reload');
  });
  
});
gulp.task('dev', ['livesourcesync']);

gulp.task('default', ['build']);
