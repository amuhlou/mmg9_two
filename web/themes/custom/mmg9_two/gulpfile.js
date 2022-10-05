// -------------------------------------
//
//   Gulpfile
//
// -------------------------------------

/* global require */

const gulp = require('gulp');
const { series } = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');
const svgmin = require('gulp-svgmin');
const cleanCSS = require('gulp-clean-css');
//const imagemin = require('gulp-imagemin');
const stylelint = require('gulp-stylelint');
const terser = require('gulp-terser');
const changed = require('gulp-changed');

// These are used in the options below.
let paths = {
  styles: {
    src: 'sass/**/*.scss',
    dest: 'dist/'
  },
  scripts: {
    src: 'js/*.js',
    dest: 'dist/js'
  },
  images: {
    src: 'images/**/*',
    dest: 'dist/images'
  }
};

// compress svgs
function compressImg() {
  return gulp
    .src(paths.images.src)
    .pipe(changed(paths.images.dest))
    .pipe(svgmin())
    .pipe(gulp.dest(paths.images.dest));
}

function compileSass() {
  return gulp
    .src(paths.styles.src)
    .pipe(sassGlob())
    .pipe(sass())
    .on("error", sass.logError)
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.styles.dest));
}

function lintCss() {
  return gulp
    .src(paths.styles.src)
    .pipe(stylelint({
      reporters: [
        {
          formatter: 'string',
          console: true,
          failAfterError: true
        }
      ]
    }));
}

function minifyCss() {
  return gulp.src([
    'dist/**/*.css',
    '!dist/*.min.css',
    '!dist/**/*.min.css'

  ])
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(cleanCSS({ compatibility: 'ie11' }))
    .pipe(gulp.dest('dist'));
}

function terserScripts() {
  return gulp
    .src(paths.scripts.src)
    .pipe(terser())
    .pipe(gulp.dest(paths.scripts.dest));
}

function watchCssJsImg() {
  // gulp.watch takes in the location of the files to watch for changes
  // and the name of the function we want to run on change
  gulp.watch(paths.styles.src, series(compileSass, minifyCss));
  gulp.watch(paths.scripts.src, terserScripts);
  gulp.watch(paths.images.src, compressImg);
}

// Don't forget to expose the tasks!
exports.watch = watchCssJsImg;

exports.build = series(
  compileSass,
  //compressSvg,
  compressImg,
  minifyCss,
  terserScripts
);

exports.buildLint = series(
  compileSass,
  compressImg,
  //compressSvg,
  minifyCss,
  terserScripts,
  lintCss
);
