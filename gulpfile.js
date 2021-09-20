const {series, parallel, src, dest, watch} = require('gulp');
const del = require("del");
const sass = require("gulp-sass");
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');
const svgSprite = require('gulp-svg-sprite');

//Pathes
var path = {
  css: 'app/src/css',
  scss: 'app/src/scss',
  js: 'app/src/js',
  fonts: 'app/src/fonts',
  images: 'app/src/img',
  tmp: 'app/src/tmp',
  production: 'app/build',
  sprite: 'app/src/svg'
};

function onError(err) {
  console.log(err);
  this.emit
}

function cleanDev(cb) {
  del(path.css + '/main.css');
  del(path.production + '/css/*');
  cb();
}

function cleanFull(cb) {
  del(path.css + '/main.css');
  del(path.production + '/*');
  del(path.tmp + "/*");
  cb();
}

function scss() {
  return src(path.scss + '/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(dest(path.css));
}

function buildCSS(cb) {
  return src(path.css + '/*.css')
    .pipe(dest(path.production + '/css'))
    .pipe(browserSync.stream())
}

function buildJS(cb) {
  return src(path.js + '/*.js')
    .pipe(babel({
        presets: [
          ["@babel/env", {"targets": {
                  "browsers": ["last 2 versions", "ie 8"]
              }, "modules": false}]
        ],
        compact: true
    }))
    .pipe(dest(path.production + '/js'))
    .pipe(browserSync.stream())
}

function reload() {
  browserSync.reload();
}

function serve(done) {
  browserSync.init({
    server: {
      baseDir: './app'
    }
  });
  done();
}

function watchFiles(done) {
  watch(path.scss + '/*.scss', series(cleanDev, scss, buildCSS));
  watch(path.js + '/**/*.js', series(buildJS));

  watch("app/*.html").on('change', reload);
  done();
}

function createSprite(done) {
  return src(path.sprite + '/*.svg') // svg files for sprite
    .pipe(svgSprite({
          mode: {
              stack: {
                  sprite: "../sprite.svg"  //sprite file name
              }
          },
        }
    ))
    .pipe(dest(path.production + '/sprite'));
    done();
}

exports.default = series(cleanDev, scss, buildCSS, buildJS);
exports.dev = series(cleanDev, scss, buildCSS, buildJS, watchFiles, createSprite, serve);
