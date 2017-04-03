'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var cssmin = require('gulp-cssmin');
var jsmin = require('gulp-jsmin');




gulp.task('css', function () {
    gulp.src('./resources/sass/*.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(cssmin())
        .pipe(gulp.dest('./css'));
});

gulp.task('js', function () {
    gulp.src('./resources/js/*.js')
        .pipe(jsmin())
        .pipe(gulp.dest('./js'));

});

gulp.task('watch', function () {
    gulp.watch('./resources/sass/*.sass', ['css']);
    gulp.watch('./resources/js/*.js', ['js']);
});
