'use strict';

// Redefine: window, document, undefined.
var Module = (function() {

	/***********************************************
	 * Settings
	 ***********************************************/

	// Thanks go to Paul Irish for this little snippet of code
	var requestAnimFrame = (function() {

		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			function(callback) {
				window.setTimeout(callback, 1000 / 60);
			};

	}());

	var scrollToY = function() {

		var scrollTo = function(hash, speed, easing) {

			var scrollY = window.scrollY || document.documentElement.scrollTop,
				headerHeight = document.getElementById('header').offsetHeight,
				scrollTarget = document.getElementById(hash).offsetTop,
				currentTime = 0;

			// Min time 0.1s, max 0.8s
			// Always substract the header's height from the scrolling distance
			var time = Math.max(0.1, Math.min(Math.abs(scrollY - scrollTarget - headerHeight) / speed, 0.8));

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

			var	_tick = function() {

				currentTime += 1 / 60;

				var p = currentTime / time,
					t = easingEquations[easing](p);

				if (p < 1) {

					requestAnimFrame(_tick);

					window.scrollTo(0, scrollY + ((scrollTarget - scrollY) * t));

				}

			};

			_tick();

		};

		var handleClickEvents = function() {

			var el = document.getElementsByClassName('js-scroll');

			for (var i = 0; i < el.length; i++) {

				el[i].addEventListener('click', scrollTo.bind(null, el[i].getAttribute('data-target'), 50, 'easeInSine'), false);

			}

		};

		var scrollOnLoad = function() {

			// Strip location of hash sign
			var hash = location.hash.replace('#','');

			if (hash !== '') {

				scrollTo(hash, 50, 'easeInSine');

			}

		};

		var init = function() {

			scrollOnLoad();
			handleClickEvents();

		};

		init();

	};

	var navigation = function() {

		var nav = document.getElementById('nav'),
			navItems = nav.getElementsByClassName('nav__item');

		var handler = function(target) {

			for (var i = 0; i < navItems.length; i++) {

				navItems[i].classList.remove('is-active');

			}

			target.classList.add('is-active');

		};

		var delegateEvents = function() {

			nav.addEventListener('click', function(e) {

				handler(e.target);

			});

		};

		var hashToggle = function() {

			var hash = window.location.hash.substr(1);

			if (hash.length > 0) {

				for (var i = 0; i < navItems.length; i++) {

					if (navItems[i].getAttribute('data-target') === hash) {

						handler(navItems[i]);

					}

				}

			}

		};

		var init = function() {

			hashToggle();
			delegateEvents();

		};

		init();

	};

	var _privateMethod = function() {

		console.log('private');

	};

	var publicMethod = function() {

		_privateMethod();

	};

	var _init = function() {

		navigation();

	};

	_init();

	return {
		scrollToY: scrollToY,
		publicMethod: publicMethod
	};

}());

// Automate task by looping through the return object?!?
document.addEventListener('DOMContentLoaded', function() {

	Module.scrollToY();
	Module.publicMethod();

});
