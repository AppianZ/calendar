/**
 * Created by appian on 2017/4/12.
 */
var sass         = require('gulp-sass');
var gulp         = require('gulp');
var postcss      = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var precss       = require('precss');
var cssnano      = require('cssnano');
var sourcemaps   = require('gulp-sourcemaps');
var fs           = require('fs');
var browserSync  = require('browser-sync').create();
var reload       = browserSync.reload;

gulp.task('serve', ['scssToCss'], function () {
	browserSync.init({
		server: "./"
	});
	gulp.watch("./calendar/*.scss", ['scssToCss']);
	gulp.watch("./calendar/*.js").on('change', reload);
	gulp.watch("./calendar/*.html").on('change', reload);
});

var process = [
	autoprefixer({ browsers: ['last 2 version', 'safari 5', 'opera 12.1', 'ios 6', 'android 4', '> 10%'] }),
	precss,
	cssnano
];

gulp.task('scssToCss', function () {
	return gulp.src(['./calendar/*.scss'])
	.pipe(sourcemaps.init())
	.pipe(sass().on('error', sass.logError))
	.pipe(postcss(process))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('./calendar/'))
	.pipe(browserSync.reload({ stream: true }));
});
gulp.task('default', ['serve']); //默认任务
