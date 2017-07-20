var gulp         = require('gulp');
var del = require("del");
var tsc = require("gulp-typescript");
var tsProject = tsc.createProject("tsconfig.json");
var shell = require('shelljs');
var sass = require('gulp-sass');


/**
 * Remove angular build directory.
 */
gulp.task('clean', function (cb) {
    return del(["build/*", "css/*"], cb);
});

/**
 * Compile TypeScript sources in build directory.
 */
gulp.task("compile", ['clean'], function () {
    var tsResult = gulp.src(['assets/**/*.ts'])
        .pipe(tsc(tsProject));
    return tsResult.js
        .pipe(gulp.dest("build"));
});

/**
 * Clears the Drupal cache.
 */
gulp.task('cache-clear', function(){
    shell.exec('drush cache-rebuild');
});

/**
 * Copy all resources that are not TypeScript files into build directory.
 */
gulp.task("resources", ['clean'], function () {
    return gulp.src(["assets/**/*", "!**/*.ts"])
        .pipe(gulp.dest("build"))
});

gulp.task("sass", ['clean'], function(){
    return gulp.src('scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('css'));
});


/**
 * Build the angular project.
 */
gulp.task("build", ['sass', 'compile', 'resources'], function () {
    console.log("Build complete, clearing the Drupal cache...");
    return gulp.start('cache-clear');
});

gulp.task('watch', function() {
    console.log('starting watch');
    gulp.watch(['assets/**/*', 'scss/**/*.scss'], function(){
        return gulp.start('build');
    });
});