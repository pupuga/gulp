'use strict';

const gulp = require('gulp');
const rimraf = require('rimraf');
const plumber = require('gulp-plumber');

const sass = require('gulp-sass');
//const sass = require('gulp-ruby-sass');
const cleanCss = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');

const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const gutil = require('gulp-util');
const es = require('event-stream');

const sourcemaps = require('gulp-sourcemaps');

const imagemin = require('gulp-imagemin');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const imageminPngquant = require('imagemin-pngquant');
const svgSprite = require("gulp-svg-sprites");

const src = './_src/custom/';
const modules = './_src/modules/';
const dist = './dist/';

gulp.task('rimraf', function (cb) {
    rimraf(dist + '**/*.*', cb);
});

let filesSass = [src + 'scss/main.scss', src + 'scss/admin.scss'];
gulp.task('sass:dev', function () {
    return gulp.src(filesSass)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({errLogToConsole: true}))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dist + 'css/'));
});

gulp.task('sass', function () {
    return gulp.src(filesSass)
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(cleanCss({keepBreaks: false}))
        .pipe(gulp.dest(dist + 'css/'));
});


/*
gulp.task('sass', () =>
    sass(filesSass)
        .on('error', sass.logError)
        .pipe(plumber())
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(cleanCss({keepBreaks: false}))
        .pipe(gulp.dest(dist + 'css/'))
);
*/


let filesJs = ['main.js', 'admin.js', 'login.js'];
gulp.task('js:dev', function () {
    let tasks = filesJs.map(function (entry) {
        return browserify({entries: [src + 'js/' + entry]})
            .transform('babelify', {presets: ["env"]})
            .bundle()
            .pipe(source(entry))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .on('error', gutil.log)
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(dist + 'js/'))
    });
    return es.merge.apply(null, tasks);
});

gulp.task('js', function () {
    let tasks = filesJs.map(function (entry) {
        return browserify({entries: [src + 'js/' + entry]})
            .transform('babelify', {presets: ["env"]})
            .bundle()
            .pipe(source(entry))
            .pipe(buffer())
            .pipe(uglify())
            .pipe(gulp.dest(dist + 'js/'))
    });
    return es.merge.apply(null, tasks);
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

gulp.task('images', function () {
    imagesTask('images/**', 'images/');
});

gulp.task('uploads', function () {
    imagesTask('uploads/**', dist + 'uploads/');
});

gulp.task('sprites', function () {
    return gulp.src(src + 'sprites/*.svg')
        .pipe(svgSprite({mode: 'symbols'}))
        .pipe(gulp.dest(dist + 'sprites/'));
});

gulp.task('del', ['rimraf']);
gulp.task('up', ['uploads']);
//gulp.task('default', ['sass:dev', 'js:dev', 'images', 'uploads', 'sprites']);
gulp.task('default', ['sass:dev']);
gulp.task('watch-sass', function () {
    gulp.watch([src + 'scss/**/*.scss', modules + '/**/*.scss'], ['sass']);
    gulp.watch([src + 'scss/**/*.css', modules + '/**/*.css'], ['sass']);
});
gulp.task('watch', function () {
    gulp.watch([src + 'scss/**/*.scss'], ['sass:dev']);
    gulp.watch([src + 'scss/**/*.css'], ['sass:dev']);
    gulp.watch([src + '**/*.js'], ['js:dev'])
});
gulp.task('prod', ['sass'/*, 'js', 'images', 'uploads', 'sprites'*/]);