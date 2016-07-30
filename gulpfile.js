'use strict';


/**
 * Dependencies
 *******************************************/

var gulp 			= require('gulp'),
	

	/** Utils */
	watch 			= require('gulp-watch'),
	requireDir 		= require('require-dir'),
	del 			= require('del'),
	runSequence 	= require('run-sequence'),
	util 			= require('gulp-util'),
	browserSync 	= require('browser-sync').create('jekyll'),

	/** Config */
	paths 			= require('./package.json').paths,

	/** Import Main Tasks */
	tasks 			= requireDir('./gulp-tasks');

/** Helper Tasks */

// Compile all assets
gulp.task('build:assets', ['buildCss', 'buildJs', 'optimizeImg']);

// Delete dist directory
gulp.task('build:clean', function() {
    del(paths.dest + 'assets/').then(paths => {
    	console.log('Deleted files and folders:\n', paths.join('\n'));
	});
});


/**
 * BrowserSync
 *******************************************/

// Init server to build directory
gulp.task('browser', function() {
	browserSync.init({
		server: "./" + paths.dest,
	});
});

// Force reload across all devices
gulp.task('browser:reload', function() {
	browserSync.reload();
});


/**
 * Main Tasks
 *******************************************/

gulp.task('serve', ['browser'], function() {

	// Compile assets and build Jekyll files on load
	runSequence('buildJekyll', ['buildCss', 'buildJs']);
	
	// CSS/SCSS
	watch([
		paths.fonts.src + '*',
		paths.sass.src + 'main.scss',
		paths.sass.src + '*.scss',
		paths.sass.src + '**/*.scss',
	], function() {
		runSequence('buildCss', ['browser:reload']);
	});

	// JS
	watch([
		paths.js.src + '*.js',
		paths.js.src + '**/*.js'
	], function() {
		runSequence('buildJs', ['browser:reload']);
	});

	// Images
	watch([
		paths.img.src + '*',
		paths.img.src + '**/*'
	], function() {
		runSequence('optimizeImg', ['browser:reload']);
	});

	// Markup / Posts / Data
	watch([
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
		runSequence('buildJekyll', ['build:assets', 'browser:reload']);
	});

	util.log('Watching for changes...');
});

gulp.task('build', function() {
	runSequence('build:clean', 'buildJekyll', ['build:assets']);
});

gulp.task('deploy', function() {
	util.env.env = 'prod';
	runSequence('build:clean', 'buildJekyll', ['build:assets']);
});