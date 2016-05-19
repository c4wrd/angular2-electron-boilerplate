var gulp = require('gulp'),
    del = require('del'),
    electron = require('gulp-atom-electron'),
    symdest = require('gulp-symdest')
    sass = require('gulp-sass'),
    shell = require('gulp-shell'),
    runSeq = require('run-sequence');

gulp.task('electron:clean', function(){
    return del('dist/**/*', {force:true});
});

gulp.task('electron:copy', () => {
  var fssetup = [
    {
      from: [
          "./node_modules/es6-shim/es6-shim.min.js",
          "./node_modules/reflect-metadata/Reflect.js",
          "./node_modules/systemjs/dist/system.src.js",
          "./node_modules/zone.js/dist/zone.js"
      ],
      to: "./dist/assets/js/vendor"
    },
    {
      from: "./node_modules/@angular/**/*",
      to: "./dist/assets/js/vendor/@angular"
    },
    {
      from: "./node_modules/rxjs/**/*",
      to: "./dist/assets/js/vendor/rxjs"
    },
    {
      from: ['./src/**/*', '!./src/assets/scss/*'],
      to: './dist'
    }
  ];

  return fssetup.map((setup) => {
    return gulp.src(setup.from).pipe(gulp.dest(setup.to));
  });
});

gulp.task('electron:transpile:sass', function() {
     gulp.src('./src/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist'));
});

gulp.task("sass:watch", function() {
   gulp.watch('./src/**/*.scss',['electron:transpile:sass']);
});

gulp.task('electron:transpile:ts', shell.task(['tsc']));

gulp.task("typescript:watch", function() {
   gulp.watch('./src/**/*.ts',['electron:transpile:ts']);
});

gulp.task('electron:build:osx', function(){
    gulp.src(['dist/electron-package/**/*'])
        .pipe(electron({
            version: '1.0.2',
            platform: 'darwin' }))
        .pipe(symdest('packages/osx'));
});

gulp.task('electron:build:linux', function(){
    gulp.src(['dist/electron-package/**/*'])
        .pipe(electron({
            version: '1.0.2',
            platform: 'linux' }))
        .pipe(symdest('packages/linux'));
});

gulp.task('electron:build:win', function(){
    gulp.src(['dist/electron-package/**/*'])
        .pipe(electron({
            version: '1.0.2',
            platform: 'win32' }))
        .pipe(symdest('packages/win'));
});

gulp.task('electron:build', function(done){
    return runSeq('electron:clean', 'electron:copy', 'electron:transpile:sass', 'electron:transpile:ts', done);
});

gulp.task('electron:package', (done) => {
  return runSeq('build',
    ['electron:build:win','electron:build:osx', 'electron:build:linux'], done);
});

gulp.task('build', ['electron:build']);

gulp.task('default', ['build']);
