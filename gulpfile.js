'use strict';

var gulp = require('gulp'),
    concatCss = require('gulp-concat-css'),
    minifyCSS = require('gulp-minify-css'),
    uglyfly = require('gulp-uglyfly'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    imageminJpegRecompress = require('imagemin-jpeg-recompress'),
    imageminPngquant = require('imagemin-pngquant'),
    svgSprite = require("gulp-svg-sprites");

var pathSource = './_src/';
var pathDestination = './dist/';

gulp.task('css', function() {
    gulp.src(pathSource + '/css/*.css')
        .pipe(concatCss(pathDestination + 'css/bundle.css'))
        .pipe(minifyCSS({keepBreaks: false}))
        .pipe(gulp.dest(pathDestination + 'css/'));
});

gulp.task('js', function() {
    gulp.src(pathSource + 'js/*.js')
        .pipe(concat('bundle.js'))
        .pipe(uglyfly())
        .pipe(gulp.dest(pathDestination + 'js/'))
});

function imagesTask(folder, folderOut) {
gulp.src(pathSource + folder)
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
	.pipe(gulp.dest(pathDestination + folderOut));
}

gulp.task('images', function() {
    imagesTask(pathSource + 'images/**', pathDestination + 'images/');
});

gulp.task('uploads', function() {
    imagesTask(pathSource + 'uploads/**', pathDestination + 'uploads/');    	    
});

gulp.task('sprites', function () {
    return gulp.src(pathSource + 'sprites/*.svg')
        .pipe(svgSprite({mode: "symbols"}))
        .pipe(gulp.dest(pathDestination + 'images/sprites/'));
});

gulp.task('default', ['css', 'js']);
gulp.task('graph', ['images', 'uploads', 'sprites']);
gulp.task('everything', ['css', 'js', 'images', 'uploads', 'sprites']);