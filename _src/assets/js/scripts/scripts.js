/** Stuffz */

var Wolfpilot = window.Wolfpilot || {};

Wolfpilot = (function() {

	'use strict';

	/** HELPERS */

	var _raf = (function _raf() {
		// Thanks go to Paul Irish for this little snippet of code
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			function(callback) {
				window.setTimeout(callback, 1000 / 60);
			};

	}());

	var lazyload = function lazyload(el) {

		if (el.hasAttribute('data-lazyload-src')) {

			el.setAttribute('src', el.getAttribute('data-lazyload-src'));
			el.removeAttribute('data-lazyload-src');

		}

	};


	/** MAIN */

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

	var overlay = (function overlay() {

		var el = document.getElementById('overlay'),
			status = 'closed';

		var open = function open() {

			status = 'open';
			el.classList.add('is-active');

		};

		var close = function close() {

			status = 'closed';
			el.classList.remove('is-active');

		};

		var handler = function handler() {

			if (status === 'closed') {

				open();

			} else {

				close();

			}

		};

		return {
			handler: handler,
			open: open,
			close: close
		};

	}());

	var modal = (function modal() {

		var showcase = document.getElementById('js-showcase-content'),
			modall = document.getElementById('js-modal'),
			wrapper = document.getElementById('js-modal-wrapper'),
			closeBtn = document.getElementById('js-modal--close'),
			status = 'closed';

		var open = function open(target) {

			status = 'open';

			overlay.handler();
			modall.classList.add('is-active');
			// target.classList.add('is-visible');

		};

		var close = function close(target) {

			status = 'closed';

			overlay.handler();
			modall.classList.remove('is-active');
			// target.classList.remove('is-visible');

		};

		var handler = function handler(target) {

			if (status === 'closed') {

				open(target);

			} else {

				close(target);

			}

		};

		var _delegateEvents = function _delegateEvents() {

			showcase.addEventListener('click', function(e) {

				if (e.target.classList.contains('showcase__project-overlay')) {

					handler(e.target.parentNode.parentNode);

				}

			});

			closeBtn.addEventListener('click', function() {

				handler();

			});

			/* if modal is open and
			 * the target is not the modal's wrapper nor the trigger
			 * then forward to event handler */
			document.addEventListener('mousedown', function(e) {

				if (status === 'open' && !wrapper.contains(e.target)) {

					handler();

				}

			});

		};

		var _init = function _init() {

			_delegateEvents();

		};

		_init();

		return {
			status: status,
			open: open,
			close: close,
			handler: handler
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

	var showcase = (function showcase() {

		var wrapper = document.getElementById('js-showcase'),
			nav = wrapper.querySelector('#js-showcase-nav'),
			navTags = nav.getElementsByClassName('showcase__nav-item'),
			projects = wrapper.getElementsByClassName('js-showcase-project');

		var showCategory = function showCategory(category) {

			setTimeout(function() {

				for (var i = 0; i < projects.length; i++) {

					var tags = projects[i].getAttribute('data-tag').split(', ');

					for (var j = 0; j < tags.length; j++) {

						if (tags[j] === category) {

							projects[i].classList.add('is-visible');
							lazyload(projects[i].firstElementChild);

						}

					}

				}

			}, 500);

		};

		var showAll = function hideEverything() {

			setTimeout(function() {

				for (var i = 0; i < projects.length; i++) {

					projects[i].classList.add('is-visible');
					lazyload(projects[i].firstElementChild);

				}
			}, 500);

		};

		var hideAll = function hideEverything() {

			for (var i = 0; i < projects.length; i++) {

				projects[i].classList.remove('is-visible');

			}

		};

		var handler = function handler(category) {

			hideAll();

			if (category === 'all') {

				showAll();

			} else {

				showCategory(category);

			}

		};

		var toggleNav = function toggleNav(category) {

			for (var i = 0; i < navTags.length; i++) {

				navTags[i].classList.remove('is-active');

			}

			category.classList.add('is-active');

		};

		var _delegateEvents = (function _delegateEvents() {

			nav.addEventListener('click', function(e) {

				if (e.target.classList.contains('showcase__nav-item') && !e.target.classList.contains('is-active')) {

					toggleNav(e.target);
					handler(e.target.getAttribute('data-category'));

				}

			});

		}());

		return {
			showCategory: showCategory,
			showAll: showAll,
			hideAll: hideAll,
			toggleNav: toggleNav
		};

	}());

	return {
		scrollToY: scrollToY,
		overlay: overlay,
		modal: modal,
		showcase: showcase
	};

}());
