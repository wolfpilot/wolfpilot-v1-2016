'use strict';

// Redefine: window, document, undefined.
var Module = (function() {

	/***********************************************
	 * Settings
	 ***********************************************/

	var init = function() {

	};

	// Thanks go to Paul Irish for this little snippet of code
	var requestAnimFrame = (function() {

		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			function(callback) {
				window.setTimeout(callback, 1000 / 60);
			};

	}());

	var scrollToY = function(scrollTarget, speed, easing) {

		var scrollY = window.scrollY || document.documentElement.scrollTop,
			scrollTarget = scrollTarget || 0,
			speed = speed || 250, // In px/s
			easing = easing || 'easeInSine',
			currentTime = 0;

		// Min time 0.1s, max 0.8s
		var time = Math.max(0.1, Math.min(Math.abs(scrollY - scrollTarget) / speed, 0.8));

		// Source: https://github.com/danro/easing-js/blob/master/easing.js
		var easingEquations = {

			easeInSine: function (pos) {
				return -Math.cos(pos * (Math.PI / 2)) + 1;
			},
			easeOutSine: function (pos) {
				return Math.sin(pos * (Math.PI / 2));
			},
			easeInOutSine: function (pos) {
				return (-0.5 * (Math.cos(Math.PI * pos) - 1));
			},
			easeInOutQuint: function (pos) {
				if ((pos /= 0.5) < 1) {
					return 0.5 * Math.pow(pos, 5);
				}
				return 0.5 * (Math.pow((pos - 2), 5) + 2);
			}

		};

		function tick() {

			currentTime += 1 / 60;

			var p = currentTime / time,
				t = easingEquations[easing](p);

			if (p < 1) {

				requestAnimFrame(tick);

				window.scrollTo(0, scrollY + ((scrollTarget - scrollY) * t));

			}
			// else {

			// 	window.scrollTo(0, scrollTarget - scrollY);

			// }

		}

		tick();

	};

	var scrollToEl = function() {

		var el = document.getElementsByClassName('js-scroll'),
			headerHeight = document.getElementById("header").offsetHeight;

		for (var i = 0; i < el.length; i++) {

			el[i].addEventListener('click', function() {

				var data = this.getAttribute('data-target'),
					target = document.getElementById(data);

				scrollToY(target.offsetTop - headerHeight, 50, 'easeInSine');

			}, false);

		}

	};

	var _privateMethod = function() {

	};

	var publicMethod = function() {

		_privateMethod();

	};

	return {
		init: init,
		scrollToEl: scrollToEl,
		publicMethod: publicMethod
	};

}());

// Automate task by looping through the return object?!?
document.addEventListener('DOMContentLoaded', function() {

	Module.init();
	Module.scrollToEl();
	Module.publicMethod();

});
