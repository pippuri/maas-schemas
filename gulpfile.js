'use strict';

const deref = require('gulp-jsonschema-deref');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const jsonclint = require('gulp-json-lint');
const jsonFormat = require('gulp-json-format');
const jsonlint = require('gulp-jsonlint');
const mocha = require('gulp-mocha');

const jsoncFiles = ['.eslintrc']; // json with comments
const jsonFiles = ['schemas/**/*.json'];
const jsFiles = ['*.js', 'test/**/*.js'];

gulp.task('jsonclint', () => {
  // Unfortunately does not support failOnError at the moment
  // See https://github.com/panuhorsmalahti/gulp-json-lint/issues/2
  return gulp.src(jsoncFiles)
    .pipe(jsonclint({ comments: true }))
    .pipe(jsonclint.report('verbose'));
});

gulp.task('jsonlint', () => {
  return gulp.src(jsonFiles)
    .pipe(jsonlint())
    .pipe(jsonlint.reporter())
    .pipe(jsonlint.failOnError());
});

gulp.task('eslint', () => {
  return gulp.src(jsFiles)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('deref-schemas', () => {
  return gulp.src('./schemas/**/*.json')
      .pipe(deref())
      .pipe(jsonFormat(2))
      .pipe(gulp.dest('prebuilt'));
});

gulp.task('test', ['validate'], () => {
  return gulp.src('./test/test.js', { read: false })
    .pipe(mocha());
});

gulp.task('validate', ['jsonclint', 'jsonlint', 'eslint']);

gulp.task('watch', () => {
  gulp.watch([].concat(jsonFiles, jsoncFiles, jsFiles), ['test', 'deref-schemas']);
});

gulp.task('default', ['test', 'deref-schemas']);
