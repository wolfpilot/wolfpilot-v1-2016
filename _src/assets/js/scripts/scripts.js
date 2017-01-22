/** Stuffz */

var Wolfpilot = window.Wolfpilot || {};

Wolfpilot = (function Wolfpilot() {

	'use strict';

	var _raf = (function _raf() {
		// Thanks go to Paul Irish for this little snippet of code
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			function(callback) {
				window.setTimeout(callback, 1000 / 60);
			};

	}());

	var scrollToY = (function scrollToY() {

		var scrollTo = function scrollTo(hash, speed, easing) {

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

					_raf(_tick);

					window.scrollTo(0, scrollY + ((scrollTarget - scrollY) * t));

				}

			};

			_tick();

		};

		var _handleClickEvents = function _handleClickEvents() {

			var el = document.getElementsByClassName('js-scroll');

			for (var i = 0; i < el.length; i++) {

				el[i].addEventListener('click', scrollTo.bind(null, el[i].getAttribute('data-target'), 50, 'easeInSine'), false);

			}

		};

		var _scrollOnLoad = function _scrollOnLoad() {

			// Strip location of hash sign
			var hash = location.hash.replace('#','');

			if (hash !== '') {

				scrollTo(hash, 50, 'easeInSine');

			}

		};

		var _init = function _init() {

			_scrollOnLoad();
			_handleClickEvents();

		};

		_init();

		return {
			scrollTo: scrollTo
		};

	}());

	var _navigation = (function _navigation() {

		var nav = document.getElementById('nav'),
			navItems = nav.getElementsByClassName('nav__item');

		var handler = function handler(target) {

			for (var i = 0; i < navItems.length; i++) {

				navItems[i].classList.remove('is-active');

			}

			target.classList.add('is-active');

		};

		var _delegateEvents = function _delegateEvents() {

			nav.addEventListener('click', function(e) {

				handler(e.target);

			});

		};

		var _hashToggle = function _hashToggle() {

			var hash = window.location.hash.substr(1);

			if (hash.length > 0) {

				for (var i = 0; i < navItems.length; i++) {

					if (navItems[i].getAttribute('data-target') === hash) {

						handler(navItems[i]);

					}

				}

			}

		};

		var _init = function _init() {

			_hashToggle();
			_delegateEvents();

		};

		_init();

	}());

	return {
		scrollToY: scrollToY
	};

}());
