'use strict';

var gulp        = require('gulp'),
    /** Utilities */
    rename      = require('gulp-rename'),
    filesize    = require('gulp-filesize'),
    sourcemaps 	= require('gulp-sourcemaps'),
    /** JS */
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    /** Config */
    paths       = require('../../package.json').paths;

/**
 * Optimize JS Task
 *******************************************/

gulp.task('deploy:scripts', function () {

	return gulp.src([
			paths.js.src + 'vendor/*.js',
			paths.js.src + 'lib/*.js',
			paths.js.src + 'scripts/*.js'
		])
	           .pipe(sourcemaps.init())
	           .pipe(concat('scripts.js'))
	           .pipe(gulp.dest(paths.js.dest))
	           .pipe(uglify())
	           .pipe(rename({ extname: '.min.js' }))
	           .pipe(filesize())
	           .pipe(sourcemaps.write('maps'))
	           .pipe(gulp.dest(paths.js.dest));

});