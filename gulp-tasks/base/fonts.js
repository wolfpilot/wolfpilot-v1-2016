'use strict';

var gulp            = require('gulp'),
    /** Config */
    paths           = require("../../package.json").paths;

/**
 * Fonts Task
 *******************************************/

gulp.task('fonts', function () {

	// Copy any font files in source to public
	return gulp.src(paths.fonts.src + '*')
                .pipe(gulp.dest(paths.fonts.dest));

});