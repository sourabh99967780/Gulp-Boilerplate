"use strict";

// Initialize the modules
var _require = require('gulp'),
    src = _require.src,
    dest = _require.dest,
    watch = _require.watch,
    series = _require.series,
    parallel = _require.parallel;

var autoprefixer = require('autoprefixer');

var cssnano = require('cssnano');

var concat = require('gulp-concat');

var postcss = require('gulp-postcss');

var replace = require('gulp-replace');

var sass = require('gulp-sass');

var sourcemaps = require('gulp-sourcemaps');

var uglify = require('gulp-uglify'); // File path variables


var files = {
  scssPath: 'app/scss/**/*.scss',
  jsPath: 'app/js/**/*.js'
}; // Sass task

function scssTask() {
  return src(files.scssPath).pipe(sourcemaps.init()).pipe(sass()).pipe(postcss([autoprefixer(), cssnano()])).pipe(sourcemaps.write('.')).pipe(dest('dist'));
} // JS Task


function jsTask() {
  return src(files.jsPath).pipe(concat('all.js')).pipe(uglify()).pipe(dest('dist'));
} // Cachebusting Task


var cbString = new Date().getTime();

function cacheBustTask() {
  return src('index.html').pipe(replace(/cb=\d+/g, 'cb=' + cbString)).pipe(dest('.'));
} // Watch Task


function watchTask() {
  watch([files.scssPath, files.jsPath], parallel(scssTask, jsTask));
} // Default Task


exports["default"] = series(parallel(scssTask, jsTask), cacheBustTask, watchTask);