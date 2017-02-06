/** Stuffz */

var Wolfpilot = window.Wolfpilot || {};

Wolfpilot = (function() {

	'use strict';

	/** HELPERS */

	// Get the inner width and height of the window
	var windowSize = (function windowSize() {

		var wWidth,
			wHeight,
			timeout = false,
			delay = 250; // time to wait before running the callback

		var _setDimensions = function _setDimensions() {

			wWidth = window.innerWidth;
			wHeight = window.innerHeight;

		};

		var getDimensions = function getDimensions() {

			return {
				wWidth,
				wHeight
			};

		};

		window.addEventListener('resize', function() {

			clearTimeout(timeout);

			timeout = setTimeout(_setDimensions, delay);

		});

		_setDimensions();

		return {
			getDimensions
		};

	}());

	// Get nearest parent element matching selector
	var getClosest = function getClosest(el, selector) {

		var matchesSelector = el.matches
			|| el.webkitMatchesSelector
			|| el.mozMatchesSelector
			|| el.msMatchesSelector;

		while (el) {

			if (matchesSelector.call(el, selector)) {
				break;
			}

			el = el.parentElement;

		}

		return el;

	};

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

		var wrapper = document.getElementById('js-modal'),
			images = wrapper.getElementsByClassName('modal__img'),

			btnPrev = document.getElementById('js-modal--prev'),
			btnNext = document.getElementById('js-modal--next'),
			btnClose = document.getElementById('js-modal--close'),

			status = 'closed',

			showcasedItems,
			activeItem,
			index,
			prevItem,
			nextItem;

		var setShowcasedItems = function setShowcasedItems(newShowcasedItems) {

			showcasedItems = newShowcasedItems;

		};

		var getShowcasedItems = function getShowcasedItems() {

			return showcasedItems;

		};

		var setActiveItem = function setActiveItem(el, i) {

			activeItem = el;
			index = i;

		};

		var getActiveItem = function getActiveItem() {

			return {
				activeItem,
				index
			};

		};

		var prev = function prev() {

			var i;

			// Go to the previous slide unless we've reached the first one
			if (showcasedItems[index] !== showcasedItems[0]) {

				prevItem = document.getElementById(showcasedItems[index - 1]);
				i = index - 1;

			} else { // otherwise, loop around

				prevItem = document.getElementById(showcasedItems[showcasedItems.length - 1]);
				i = showcasedItems.length - 1;

			}

			lazyload(prevItem);
			activeItem.classList.remove('is-visible');
			prevItem.classList.add('is-visible');

			setActiveItem(prevItem, i);

		};

		var next = function next() {

			var i;

			// Go to the next slide unless we've reached the last one
			if (showcasedItems[index] !== showcasedItems[showcasedItems.length - 1]) {

				nextItem = document.getElementById(showcasedItems[index + 1]);
				i = index + 1;

			} else { // otherwise, loop around

				nextItem = document.getElementById(showcasedItems[0]);
				i = 0;

			}

			lazyload(nextItem);
			activeItem.classList.remove('is-visible');
			nextItem.classList.add('is-visible');

			setActiveItem(nextItem, i);

		};

		var open = function open() {

			status = 'open';

			overlay.handler();
			wrapper.classList.add('is-active');

			lazyload(activeItem);
			activeItem.classList.add('is-visible');

		};

		var close = function close() {

			status = 'closed';
			setActiveItem(null);

			overlay.handler();
			wrapper.classList.remove('is-active');

			for (var i = 0; i < images.length; i++) {

				images[i].classList.remove('is-visible');

			}

		};

		var handler = function handler(el, newIndex) {

			setActiveItem(el, newIndex);

			status === 'closed' ? open() : close();

		};

		var delegateEvents = function delegateEvents() {

			wrapper.addEventListener('click', function(e) {

				if (e.target === btnClose) {
					handler();
				}

				if (e.target === btnPrev) {
					prev();
				}

				if (e.target === btnNext) {
					next();
				}

			});

			document.addEventListener('mousedown', function(e) {

				if (status === 'open' && e.target === wrapper) {

					handler();

				}

			});

		};

		document.addEventListener('DOMContentLoaded', function init() {

			delegateEvents();

		});

		return {
			status: status,
			getActiveItem: getActiveItem,
			setShowcasedItems: setShowcasedItems,
			getShowcasedItems: getShowcasedItems,
			prev: prev,
			next: next,
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
			nav = document.getElementById('js-showcase-nav'),
			navTags = wrapper.getElementsByClassName('showcase__nav-item'),
			projects = wrapper.getElementsByClassName('js-showcase-project'),
			category = 'featured', // set initial category
			showcasedProjects = [];

		var setShowcasedProjects = function setShowcasedProjects(newShowcasedProjects) {

			showcasedProjects = newShowcasedProjects;

		};

		var getShowcasedProjects = function getShowcasedProjects() {

			return showcasedProjects;

		};

		var setCategory = function setCategory(newCategory) {

			category = newCategory;

		};

		var getCategory = function getCategory() {

			return category;

		};

		var showCategory = function showCategory(newCategory) {

			// Reset the array before repopulating it again
			showcasedProjects = [];

			setTimeout(function() {

				for (var i = 0; i < projects.length; i++) {

					var tags = projects[i].getAttribute('data-tag').split(', ');

					for (var j = 0; j < tags.length; j++) {

						if (tags[j] === newCategory) {

							lazyload(projects[i].firstElementChild);
							projects[i].classList.add('is-visible');

							showcasedProjects.push(projects[i].getAttribute('data-target'));

						}

					}

				}

			}, 500);

			// Update the list of currently visible projects
			setShowcasedProjects(showcasedProjects);
			Wolfpilot.modal.setShowcasedItems(showcasedProjects);

		};

		var showAll = function showAll() {

			// Reset the array before repopulating it again
			showcasedProjects = [];

			setTimeout(function() {

				for (var i = 0; i < projects.length; i++) {

					lazyload(projects[i].firstElementChild);
					projects[i].classList.add('is-visible');

					showcasedProjects.push(projects[i].getAttribute('data-target'));

				}
			}, 500);

			// Update the list of currently visible projects
			setShowcasedProjects(showcasedProjects);
			Wolfpilot.modal.setShowcasedItems(showcasedProjects);

		};

		var hideAll = function hideAll() {

			for (var i = 0; i < projects.length; i++) {

				projects[i].classList.remove('is-visible');

			}

		};

		var handler = function handler() {

			hideAll();

			category === 'all' ? showAll() : showCategory(category);

		};

		var toggleNav = function toggleNav(navItem) {

			for (var i = 0; i < navTags.length; i++) {

				navTags[i].classList.remove('is-active');

			}

			navItem.classList.add('is-active');

		};

		var delegateEvents = function delegateEvents() {

			// listen for project clicks
			wrapper.addEventListener('click', function(e) {

				if (e.target.classList.contains('showcase__project-details')) {

					var project = Wolfpilot.getClosest(e.target, '.js-showcase-project'),
						el = document.getElementById(project.getAttribute('data-target')),
						target = project.getAttribute('data-target');

					for (var i = 0; i < showcasedProjects.length; i++) {

						if (showcasedProjects[i] === target) {
							/* Pass both the modal image we're opening
							 * and its index in the currently showcased projects.
							 *
							 * This will open the image in a modal
							 * and determine its position in the slider,
							 * as well as the order of the previous and next elements.
							 */
							Wolfpilot.modal.handler(el, i);

						}

					}

				}

			});

			// listen for category changes
			nav.addEventListener('click', function(e) {

				if (e.target.classList.contains('showcase__nav-item') && !e.target.classList.contains('is-active')) {

					setCategory(e.target.getAttribute('data-category'));
					toggleNav(e.target);
					handler();

				}

			});

		};

		document.addEventListener('DOMContentLoaded', function init() {

			showCategory(category);
			delegateEvents();

		});

		return {
			getShowcasedProjects: getShowcasedProjects,
			getCategory: getCategory,
			showCategory: showCategory,
			showAll: showAll,
			hideAll: hideAll,
			handler: handler,
			toggleNav: toggleNav
		};

	}());

	return {
		windowSize: windowSize,
		getClosest: getClosest,
		scrollToY: scrollToY,
		overlay: overlay,
		modal: modal,
		showcase: showcase
	};

}());
