'use strict';

var gulp            = require('gulp'),
    /** Utilities */
    rename          = require('gulp-rename'),
    filesize        = require('gulp-filesize'),
    sourcemaps      = require('gulp-sourcemaps'),
    /** CSS/SASS */
    sass            = require('gulp-sass'),
    autoprefixer    = require('gulp-autoprefixer'),
    /** Config */
    paths           = require("../../package.json").paths;

/**
 * Optimize SASS Task
 *******************************************/

gulp.task('deploy:sass', function () {

	return gulp.src(paths.sass.src + 'main.scss')
	            .pipe(sourcemaps.init())
	            .pipe(sass({
	            	includePaths: [paths.sass.src],
	            	outputStyle: 'compressed'
	            }))
	            .pipe(autoprefixer({ 'browserlist' : [
	                    '> 1%',
	                    'last 2 versions',
	                    'Firefox ESR',
	                    'ie >= 10'
	                ]
	            }))
	            .pipe(filesize())
	            .pipe(rename({ extname: '.min.css' }))
	            .pipe(sourcemaps.write('maps'))
	            .pipe(gulp.dest(paths.css.dest));

});