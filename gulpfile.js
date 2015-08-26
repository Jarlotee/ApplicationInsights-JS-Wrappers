/*
This file in the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/

var gulp = require('gulp');
var watch = require('gulp-watch');
var tsc = require('gulp-typescript');

var tsProject = tsc.createProject('tsconfig.json', {
    typescript: require("typescript")
});

var tsSource = "src/**/*.ts";

gulp.task("ts-compile", function () {
    var result = gulp.src(tsSource)
        .pipe(tsc(tsProject));

    return result.js.pipe(gulp.dest('dist'));
});

gulp.task("ts-watch", function () {
    watch(tsSource, function () {
        gulp.start('ts-compile');
    });
});

gulp.task('build', ['ts-compile']);
gulp.task('default', ['ts-watch']);