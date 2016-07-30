var gulp        = require('gulp'),
	/** Utilities */
	util 		= require('gulp-util'),
	cp 			= require('child_process');

/**
 * Build Jekyll Task
 *******************************************/

gulp.task('buildJekyll', function (callback) {

	var env = (util.env.env === 'prod' || util.env.env === 'production') ? '_config.prod.yml' : '_config.yml';
	
	cp.exec('jekyll build --config ' + env, function(err, stdout, stderr) {

		callback(err);
		util.log(stdout !== null ? stdout : null);
		util.log(err !== null ? 'ERROR: Jekyll process exited with code: '+err.code : null);

	});

});