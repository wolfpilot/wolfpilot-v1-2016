'use strict';

var gulp        = require('gulp'),
    /** JS */
    eslint      = require('gulp-eslint'),
    concat      = require('gulp-concat'),
    /** Config */
    paths       = require('../../package.json').paths;

/**
 * JS Task
 *******************************************/

gulp.task('scripts', function () {

	return gulp.src([
			paths.js.src + 'vendor/*.js',
			paths.js.src + 'lib/*.js',
			paths.js.src + 'scripts/*.js'
		])
	           .pipe(concat('main.js'))
	           .pipe(gulp.dest(paths.js.src))
	           .pipe(eslint())
	           .pipe(eslint.format())
	           .pipe(eslint.failAfterError())
	           .pipe(gulp.dest(paths.js.dest));

});