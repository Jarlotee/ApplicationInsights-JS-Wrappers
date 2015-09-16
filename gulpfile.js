var gulp = require('gulp');
var watch = require('gulp-watch');
var tsc = require('gulp-typescript');
var del = require('del');
var merge = require('merge2');
var tslint = require('gulp-tslint');

var tsProject = tsc.createProject('src/ts/tsconfig.json', {
    typescript: require('typescript')
});

var tsSource = 'src/ts/**/*.ts';
var dist = 'dist';

gulp.task('ts-lint', function(){
      return gulp.src(tsSource)
        .pipe(tslint())
        .pipe(tslint.report('verbose'));
});

gulp.task('ts-compile', function () {
    var result = gulp.src(tsSource)
        .pipe(tsc(tsProject));

    return merge([
            result.js.pipe(gulp.dest(dist)),
            //result.dts.pipe(gulp.dest(dist)),
        ]);
});

gulp.task('ts-watch', function () {
    watch(tsSource, function () {
        gulp.start('ts-lint')
        gulp.start('ts-compile');
    });
});

gulp.task('clean', function() {
    del(dist);
});

gulp.task('build', ['clean','ts-lint','ts-compile']);
gulp.task('default', ['ts-watch']);
