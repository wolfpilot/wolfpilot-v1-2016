'use strict';

var gulp 			= require('gulp'),
	/** BrowserSync */
	browserSync 	= require('browser-sync').create(),
	/** Config */
	paths 			= require("../../package.json").paths;

/**
 * BrowserSync
 *******************************************/

// Init server to build directory
gulp.task('browser', function() {
	
	browserSync.init({
		server: "./" + paths.dest,
		injectChanges: true,
        notify: {
            styles: {
                top: 'auto',
                bottom: '0',
                margin: '0px',
                padding: '5px',
                position: 'fixed',
                fontSize: '10px',
                zIndex: '9999',
                borderRadius: '5px 0px 0px',
                color: 'white',
                textAlign: 'center',
                display: 'block',
                backgroundColor: '#000'
            }
        }
	});
});

// Force reload across all devices
gulp.task('browser:reload', function() {
	return browserSync.reload();
});

gulp.task('browser:stream', function() {
    return gulp.src(paths.css.dest + '**/*.css')
        .pipe(browserSync.stream());
});