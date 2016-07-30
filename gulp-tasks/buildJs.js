var gulp        = require('gulp'),
	/** Utilities */
	rename      = require('gulp-rename'),
	filesize    = require('gulp-filesize'),
	sourcemaps 	= require('gulp-sourcemaps'),
	/** JS */
	eslint      = require('gulp-eslint'),
	concat      = require('gulp-concat'),
	uglify      = require('gulp-uglify'),
	/** Config */
	paths 		= require('../package.json').paths;

/**
 * Build JS Task
 *******************************************/

gulp.task('buildJs', function () {

	// Build JS
	gulp.src([
			paths.js.src + 'vendor/*.js',
			paths.js.src + 'lib/*.js',
			paths.js.src + '*.js'
		])
		.pipe(sourcemaps.init())
		.pipe(concat('main.js'))
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError())
		.pipe(uglify())
		.pipe(rename({ extname: '.min.js' }))
		.pipe(filesize())
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest(paths.js.dest));

});