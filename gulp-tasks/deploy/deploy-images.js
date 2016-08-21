'use strict';

var gulp        = require('gulp'),
	/** Images */
	imagemin 	= require('gulp-imagemin'),
	pngquant	= require('imagemin-pngquant'),
	/** Config */
	paths 		= require('../../package.json').paths;

/**
 * Optimize Images Task
 *******************************************/

gulp.task('deploy:images', function () {

	return gulp.src([
			paths.img.src + '*',
			paths.img.src + '**/*'
		])
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{ removeViewBox: false }],
			use: [pngquant({ quality: '65-75' })]
		}))
		.pipe(gulp.dest(paths.img.dest));

});