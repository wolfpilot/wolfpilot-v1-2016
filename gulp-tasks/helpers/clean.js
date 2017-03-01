'use strict';

var gulp        = require('gulp'),
    /** Utilities */
    del         = require('del'),
    cached      = require('gulp-cached'),
    /** Config */
    paths       = require("../../package.json").paths;

/**
 * Clean Task
 *******************************************/

gulp.task('clean', function() {

	cached.caches = {};

	del.sync(paths.dest);

});

// Delete assets directory
gulp.task('clean:assets', function() {
	del(paths.dest + 'assets/').then(paths => {
		console.log('Deleted files and folders:\n', paths.join('\n'));
	});
});