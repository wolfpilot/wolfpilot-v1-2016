'use strict';

var gulp        = require('gulp'),
	/** Config */
	paths 		= require('../../package.json').paths;

/**
 * Images Task
 *******************************************/

gulp.task('images', function () {

	return gulp.src([
			paths.img.src + '*',
			paths.img.src + '**/*'
		])
		.pipe(gulp.dest(paths.img.dest));

});