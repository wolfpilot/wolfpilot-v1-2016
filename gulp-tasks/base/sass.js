'use strict';

var gulp            = require('gulp'),
    /** Utilities */
    rename          = require('gulp-rename'),
    /** CSS/SASS */
    sass            = require('gulp-sass'),
    autoprefixer    = require('gulp-autoprefixer'),
    /** Config */
    paths           = require("../../package.json").paths;

/**
 * SASS Task
 *******************************************/

gulp.task('sass', function () {

	return gulp.src(paths.sass.src + 'main.scss')
	           .pipe(sass({ includePaths: [paths.sass.src]	})
	           .on('error', sass.logError))
	           .pipe(autoprefixer({ 'browserlist' : [
	                    '> 1%',
	                    'last 2 versions',
	                    'Firefox ESR',
	                    'ie >= 10'
	                ]
	           }))
	           .pipe(rename({ extname: '.css' }))
	           .pipe(gulp.dest(paths.css.dest));

});