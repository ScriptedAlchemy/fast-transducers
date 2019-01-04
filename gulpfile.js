const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const sweetjs = require('gulp-sweetjs');
const header = require('gulp-header');

gulp.task('compile', () => {
  gulp.src(['tests/**/*.js', 'foo.js'])
    .pipe(sourcemaps.init())
    .pipe(header('require("source-map-support");'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build'));
});

gulp.task('watch', () => {
  gulp.watch(['tests/**/*.js', 'foo.js'], ['compile']);
});

gulp.task('default', ['compile']);
