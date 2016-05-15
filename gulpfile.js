var gulp = require('gulp'),
    del = require('del'),
    sass = require("gulp-sass")
    runSeq = require('run-sequence');

gulp.task('clean', function(){
    return del('dist/frontend/**/*', {force:true});
});

gulp.task('copy:vendor', function(){
    return gulp.src([
            "node_modules/es6-shim/es6-shim.min.js",
            "node_modules/reflect-metadata/Reflect.js",
            "node_modules/systemjs/dist/system.src.js",
            "node_modules/zone.js/dist/zone.js"
        ])
        .pipe(gulp.dest('./dist/frontend/assets/js/vendor'))
})

gulp.task('copy:angular', function() {
   return gulp.src('node_modules/@angular/**/*')
        .pipe(gulp.dest('./dist/frontend/assets/js/vendor/@angular'));
});

gulp.task('copy:rxjs', function() {
   return gulp.src('node_modules/rxjs/**/*')
        .pipe(gulp.dest('./dist/frontend/assets/js/vendor/rxjs'));
});

gulp.task('copy:index', function(){
    return gulp.src('./src/frontend/index.html')
        .pipe(gulp.dest('./dist/frontend'));
});

gulp.task('copy:systemconfig', function(){
    return gulp.src('./src/frontend/systemjs.config.js')
        .pipe(gulp.dest('./dist/frontend/assets/js'));
});

gulp.task('copy:assets', function() {
    return gulp.src('./src/frontend/assets')
        .pipe(gulp.dest('./dist/frontend'));
})

gulp.task('transpile:sass', function() {
     gulp.src('./src/frontend/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/frontend/assets/css/'));
});

gulp.task("sass:watch", function() {
   gulp.watch('./src/frontend/scss/**/*.scss',['transpile:sass']);
});

gulp.task('build', function(done){
    return runSeq('clean',
    ['copy:vendor',
    'copy:index',
    'copy:systemconfig',
    'copy:assets',
    'copy:angular',
    'copy:rxjs',
    'transpile:sass'], done);
})

gulp.task('default', ['build']);
