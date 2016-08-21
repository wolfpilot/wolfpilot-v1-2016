'use strict';

var gulp 			= require('gulp'),
	/** Utils */
	runSequence 	= require('run-sequence'),
	util 			= require('gulp-util'),
	/** Config */
	paths 			= require("../../package.json").paths;

/**
 * Watch task
 *******************************************/

gulp.task('watch', function() {

	// CSS/SCSS
	gulp.watch([
		paths.sass.src + 'main.scss',
		paths.sass.src + '*.scss',
		paths.sass.src + '**/*.scss',
	], function() {
		runSequence(
			'css',
			'sass',
			'browser:stream'
		);
	});

	// JS
	gulp.watch([
		paths.js.src + '*.js',
		paths.js.src + '**/*.js'
	], function() {
		runSequence(
			'scripts',
			'browser:reload'
		);
	});

	// Fonts
	gulp.watch([
		paths.fonts.src + '*'
	], function() {
		runSequence(
			'fonts',
			'browser:reload'
		);
	});

	// Images
	gulp.watch([
		paths.img.src + '*',
		paths.img.src + '**/*'
	], function() {
		runSequence(
			'images',
			'browser:reload'
		);
	});

	// Markup / Posts / Data
	gulp.watch([
		paths.src + '*',
		paths.src + '_data/*',
		paths.src + '_plugins/*',
		paths.src + '**/*.md',
		paths.src + '**/*.html',
		paths.src + '**/*.markdown',
		paths.src + '_includes/**/*.md',
		paths.src + '_includes/**/*.svg',
		paths.src + '_includes/**/*.html',
	], function() {
		runSequence(
			'jekyll',
			'assets',
			'browser:reload'
		);
	});

	util.log('Watching for changes...');
});