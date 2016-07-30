var gulp 			= require('gulp'),
	/** Utilities */
	rename 			= require('gulp-rename'),
	filesize 		= require('gulp-filesize'),
	sourcemaps 		= require('gulp-sourcemaps'),
	/** CSS */
	sass 			= require('gulp-sass'),
	cleanCss 		= require('gulp-clean-css'),
	autoprefixer 	= require('gulp-autoprefixer'),
	/** Config */
	paths 			= require("../package.json").paths;

/**
 * Build CSS Task
 *******************************************/

gulp.task('buildCss', function () {

	// Copy any CSS files in source to public
	gulp.src(paths.css.src + '*.css')
        .pipe(gulp.dest(paths.css.dest));

    // Build SASS
	gulp.src(paths.sass.src + 'main.scss')
	 	.pipe(sourcemaps.init())
		.pipe(sass({
			includePaths: [paths.sass.src]
		}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(cleanCss())
		.pipe(filesize())
		.pipe(rename({ extname: '.min.css' }))
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest(paths.css.dest));

});