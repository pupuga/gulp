'use strict';

var gulp = require('gulp'),
    rimraf = require('rimraf'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    concatCss = require('gulp-concat-css'),
    cleanCss = require('gulp-clean-css'),
    uglyfly = require('gulp-uglyfly'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    imageminJpegRecompress = require('imagemin-jpeg-recompress'),
    imageminPngquant = require('imagemin-pngquant'),
    svgSprite = require("gulp-svg-sprites");
    //browserSync = require("browser-sync"),
    //reload = browserSync.reload

var src = './_src/';
var dist = './dist/';

gulp.task('rimraf', function (cb) {
   rimraf(dist, cb);
});

gulp.task('sassDev', function () {
    return gulp.src(src + 'scss/**/*.scss')
       .pipe(sourcemaps.init())
       .pipe(sass().on('error', sass.logError))
       .pipe(sourcemaps.write())
       .pipe(gulp.dest(dist + 'css/'));
});

gulp.task('sass', function () {
    return gulp.src(src + 'scss/**/*.scss')
       .pipe(sass().on('error', sass.logError))
       .pipe(concatCss('main.css'))
       .pipe(cleanCss({keepBreaks: false}))
       .pipe(gulp.dest(dist + 'css/'));
});

gulp.task('css', function() {
    gulp.src(src + 'css/*.css')
       .pipe(concatCss(dist + 'css/main.css'))
       .pipe(cleanCss({keepBreaks: false}))
       .pipe(gulp.dest(dist + 'css/'));
});

gulp.task('js', function() {
    gulp.src(src + 'js/*.js')
        .pipe(concat('bundle.js'))
        .pipe(uglyfly())
        .pipe(gulp.dest(dist + 'js/'))
});

gulp.task('devJs', function() {
});

function imagesTask(folder, folderOut) {
gulp.src(src + folder)
	.pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imageminJpegRecompress({
                progressive: true,
                max: 80,
                min: 70
            }),
            imageminPngquant({quality: '75-85'}),
            imagemin.svgo({plugins: [{removeViewBox: false}]})
		]))
	.pipe(gulp.dest(dist + folderOut));
}

gulp.task('images', function() {
    imagesTask(src + 'images/**', dist + 'images/');
});

gulp.task('uploads', function() {
    imagesTask(src + 'uploads/**', dist + 'uploads/');    	    
});

gulp.task('sprites', function () {
    return gulp.src(src + 'sprites/*.svg')
        .pipe(svgSprite({mode: "symbols"}))
        .pipe(gulp.dest(dist + 'sprites/'));
});

gulp.task('del', ['rimraf']);
gulp.task('default', ['devSass', 'css', 'js', 'images', 'uploads', 'sprites']);
gulp.task('watch', function () {
  gulp.watch(src + 'scss/**/*.scss', ['devSass', 'devJs']);
});
gulp.task('prod', ['sass', 'css', 'js', 'images', 'uploads', 'sprites']);