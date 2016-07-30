var gulp        = require('gulp'),
	/** Images */
	imagemin    = require('gulp-imagemin'),
	pngquant    = require('imagemin-pngquant'),
	/** Config */
	paths 		= require("../package.json").paths;

/**
 * Optimize images
 *******************************************/

gulp.task('optimizeImg', function () {

	gulp.src([
			paths.img.src + '*',
			paths.img.src + '**/*'
		])
		.pipe(imagemin({
			progressive: true,
			use: [pngquant({
				quality: '65-75'
			})]
		}))
		.pipe(gulp.dest(paths.img.dest));

});