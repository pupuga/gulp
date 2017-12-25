'use strict';

var gulp = require('gulp'),
    rimraf = require('rimraf'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    concatCss = require('gulp-concat-css'),
    cleanCss = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    babel = require('gulp-babel'),
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
    return gulp.src(src + 'scss/main.scss')
       .pipe(sourcemaps.init())
       .pipe(sass().on('error', sass.logError))
       .pipe(autoprefixer({
     	    browsers: ['last 2 versions'],
            cascade: false
        }))
       .pipe(sourcemaps.write())
       .pipe(gulp.dest(dist + 'css/'));
});

gulp.task('sass', function () {
    return gulp.src(src + 'scss/main.scss')
       .pipe(sass().on('error', sass.logError))
       .pipe(autoprefixer({
     	    browsers: ['last 2 versions'],
            cascade: false
        }))
       .pipe(concatCss('main.css'))
       .pipe(cleanCss({keepBreaks: false}))
       .pipe(gulp.dest(dist + 'css/'));
});

gulp.task('jsDev', function() {
    gulp.src(src + 'js/*.js')
       .pipe(sourcemaps.init())
       .pipe(babel({
            presets: ['env']
        }))
//       .pipe(concat('main.js'))
       .pipe(sourcemaps.write())
       .pipe(gulp.dest(dist + 'js/'))	
});

gulp.task('js', function() {
    gulp.src(src + 'js/*.js')
        .pipe(concat('main.js'))
        .pipe(uglyfly())
        .pipe(gulp.dest(dist + 'js/'))
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
        .pipe(svgSprite({mode: 'symbols'}))
        .pipe(gulp.dest(dist + 'sprites/'));
});

gulp.task('default', ['rimraf', 'sassDev', 'jsDev', 'images', 'uploads', 'sprites']);
gulp.task('watch', function () {
  gulp.watch([src + 'scss/**/*.scss', src + 'scss/**/*.css', src + 'js/**/*.js'], ['devSass', 'jsDev']);
});
gulp.task('prod', ['rimraf', 'sass', 'js', 'images', 'uploads', 'sprites']);