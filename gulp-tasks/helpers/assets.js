'use strict';

var gulp 			= require('gulp'),
	/** Utils */
	runSequence 	= require('run-sequence'),
	/** Config */
	paths 			= require("../../package.json").paths;

/**
 * Watch task
 *******************************************/

// No need to load runSequence plugin as Gulp runs all tasks in parallel by default

gulp.task('assets',
	[
		'css',
		'sass',
		'scripts',
		'images',
		'fonts'
	]
);

gulp.task('deploy:assets',
	[
		'css',
		'deploy:sass',
		'deploy:scripts',
		'deploy:images',
		'fonts'
	]
);