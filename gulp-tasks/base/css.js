'use strict';

var gulp            = require('gulp'),
    /** Config */
    paths           = require("../../package.json").paths;

/**
 * CSS Task
 *******************************************/

gulp.task('css', function () {

	// Copy any CSS files in source to public
	return gulp.src(paths.css.src + '*.css')
	            .pipe(gulp.dest(paths.css.dest));

});