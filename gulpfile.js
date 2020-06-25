const gulp = require('gulp'),
sass = require("gulp-sass"),
postcss = require("gulp-postcss"),
autoprefixer = require("autoprefixer"),
cssnano = require("cssnano"),
sourcemaps = require("gulp-sourcemaps"),
browserSync = require("browser-sync").create(),
babel = require("gulp-babel"),
concat = require("gulp-concat"),
uglify = require('gulp-uglify');


const paths = {
  styles: {
      // By using styles/**/*.sass we're telling gulp to check all folders for any sass file
      src: "src/styles/*.scss",
      // Compiled files will end up in whichever folder it's found in (partials are not compiled)
      dest: "dist"
  }
};

function javascript(cb) {
  return gulp.src([
          "node_modules/@babel/polyfill/dist/polyfill.min.js",
          "src/scripts/*.js"
      ])
      .pipe(concat("scripts.js"))
      .pipe(babel({
        presets: ['@babel/env']
      }))
      .pipe(concat("scripts.js"))
      .pipe(uglify())
      .pipe(gulp.dest("dist"))
      .pipe(browserSync.stream());
}

function style() {
  return gulp
      .src(paths.styles.src)
      // Initialize sourcemaps before compilation starts
      .pipe(sourcemaps.init())
      .pipe(concat("styles.css"))
      .pipe(sass())
      .on("error", sass.logError)
      // Use postcss with autoprefixer and compress the compiled file using cssnano
      .pipe(postcss([autoprefixer(), cssnano()]))
      // Now add/write the sourcemaps
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(paths.styles.dest))
      // Add browsersync stream pipe after compilation
      .pipe(browserSync.stream());
}

function assets() {
  return gulp
      .src("src/assets/**/*")
      .pipe(gulp.dest("dist/assets"))
}

// A simple task to reload the page
function reload() {
  browserSync.reload();
}


// Add browsersync initialization at the start of the watch task
function watch() {
  browserSync.init({
      // You can tell browserSync to use this directory and serve it as a mini-server
      server: {
          baseDir: "./"
      }
      // If you are already serving your website locally using something like apache
      // You can use the proxy setting to proxy that instead
      // proxy: "yourlocal.dev"
  });
  gulp.watch(paths.styles.src, style);
  gulp.watch("./src/scripts", javascript)
  // We should tell gulp which files to watch to trigger the reload
  // This can be html or whatever you're using to develop your website
  // Note -- you can obviously add the path to the Paths object
  gulp.watch("index.html", reload);
}

exports.style = style;
exports.javascript = javascript;
exports.watch = watch;

const build = gulp.parallel(style, javascript, assets);

gulp.task("default", build);

// exports.build = parallel(javascript, css);