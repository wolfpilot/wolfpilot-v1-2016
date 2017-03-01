'use strict';

var gulp           = require('gulp'),
    /** Utils */
    requireDir     = require('require-dir'),
    runSequence    = require('run-sequence'),
    util           = require('gulp-util'),
    /** Import Main Tasks */
    tasks          = requireDir('./gulp-tasks', { recurse: true } );

/**
 * Main Tasks
 *******************************************/

// Build
gulp.task('build', function() {
	runSequence(
		'jekyll',
		'assets'
	);
});

// Deploy
gulp.task('deploy', function() {
	util.env.env = 'prod';
	runSequence(
		'jekyll',
		'deploy:assets'
	);
});

// Serve
gulp.task('serve', function() {
	runSequence(
		'jekyll',
		'assets',
		'browser',
		'watch'
	);
});