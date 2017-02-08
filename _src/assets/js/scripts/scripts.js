/** Stuffz */

var Wolfpilot = window.Wolfpilot || {};

Wolfpilot = (function() {

	'use strict';

	/** HELPERS */

	// Set up Request Animation Frame and fallback
	var _raf = (function _raf() {
		// Thanks go to Paul Irish for this little snippet of code
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			function(callback) {
				window.setTimeout(callback, 1000 / 60);
			};

	}());

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
	var getClosestParent = function getClosestParent(el, selector) {

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

	// Scroll vertically to element
	var scrollToY = (function scrollToY() {

		var headerHeight = document.getElementById('header').offsetHeight;

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

		var scrollTo = function scrollTo(hash, speed, easing) {

			var scrollY = window.scrollY || document.documentElement.scrollTop,
				scrollTarget = document.getElementById(hash).offsetTop,
				currentTime = 0;

			// Min time 0.1s, max 0.8s
			// Always substract the header's height from the scrolling distance
			var time = Math.max(0.1, Math.min(Math.abs(scrollY - scrollTarget - headerHeight) / speed, 0.8));

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

		(function bindEvents() {

			var el = document.getElementsByClassName('js-scroll');

			for (var i = 0; i < el.length; i++) {

				el[i].addEventListener('click', scrollTo.bind(null, el[i].getAttribute('data-target'), 50, 'easeInSine'), false);

			}

		}());

		(function scrollOnLoad() {

			// Strip location of hash sign
			var hash = location.hash.replace('#','');

			if (hash !== '') {

				scrollTo(hash, 50, 'easeInSine');

			}

		}());

		return {
			scrollTo: scrollTo
		};

	}());

	// Use to lazy load images
	var lazyload = function lazyload(el) {

		if (el.hasAttribute('data-lazyload-src')) {

			el.setAttribute('src', el.getAttribute('data-lazyload-src'));
			el.removeAttribute('data-lazyload-src');

		}

	};


	/** MAIN */

	// Global overlay
	var overlay = (function overlay() {

		var el = document.getElementById('overlay'),
			status = 'closed';

		var getStatus = function getStatus() {

			return {
				status
			};

		};

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
			getStatus: getStatus,
			handler: handler,
			open: open,
			close: close
		};

	}());

	// Showcase image modal
	var modal = (function modal() {

		var wrapper = document.getElementById('js-modal'),
			images = wrapper.getElementsByClassName('modal__img'),

			btnPrev = document.getElementById('js-modal--prev'),
			btnNext = document.getElementById('js-modal--next'),
			btnClose = document.getElementById('js-modal--close'),

			status = 'closed',

			showcasedProjects,
			activeProject,
			index,
			prevProject,
			nextProject;

		var getStatus = function getStatus() {

			return {
				status
			};

		};

		var setShowcasedProjects = function setShowcasedProjects(newShowcasedProjects) {

			showcasedProjects = newShowcasedProjects;

		};

		var getShowcasedProjects = function getShowcasedProjects() {

			return showcasedProjects;

		};

		var setActiveProject = function setActiveProject(el, i) {

			activeProject = el;
			index = i;

		};

		var getActiveProject = function getActiveProject() {

			return {
				activeProject,
				index
			};

		};

		var prev = function prev() {

			var i;

			// Go to the previous slide unless we've reached the first one
			if (showcasedProjects[index] !== showcasedProjects[0]) {

				prevProject = document.getElementById(showcasedProjects[index - 1]);
				i = index - 1;

			} else { // otherwise, loop around

				prevProject = document.getElementById(showcasedProjects[showcasedProjects.length - 1]);
				i = showcasedProjects.length - 1;

			}

			lazyload(prevProject);
			activeProject.classList.remove('is-visible');
			prevProject.classList.add('is-visible');

			setActiveProject(prevProject, i);

		};

		var next = function next() {

			var i;

			// Go to the next slide unless we've reached the last one
			if (showcasedProjects[index] !== showcasedProjects[showcasedProjects.length - 1]) {

				nextProject = document.getElementById(showcasedProjects[index + 1]);
				i = index + 1;

			} else { // otherwise, loop around

				nextProject = document.getElementById(showcasedProjects[0]);
				i = 0;

			}

			lazyload(nextProject);
			activeProject.classList.remove('is-visible');
			nextProject.classList.add('is-visible');

			setActiveProject(nextProject, i);

		};

		var open = function open() {

			status = 'open';

			overlay.handler();
			wrapper.classList.add('is-active');

			lazyload(activeProject);
			activeProject.classList.add('is-visible');

		};

		var close = function close() {

			status = 'closed';
			setActiveProject(null);

			overlay.handler();
			wrapper.classList.remove('is-active');

			for (var i = 0; i < images.length; i++) {

				images[i].classList.remove('is-visible');

			}

		};

		var handler = function handler(el, newIndex) {

			setActiveProject(el, newIndex);

			status === 'closed' ? open() : close();

		};

		(function delegateEvents() {

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

			/* Prevent modal from closing when accidentally dragging
			 * from the image to outside its container
			 */
			document.addEventListener('mousedown', function(e) {

				if (status === 'open' && e.target === wrapper) {

					handler();

				}

			});

		}());

		return {
			getStatus: getStatus,
			getActiveProject: getActiveProject,
			setShowcasedProjects: setShowcasedProjects,
			getShowcasedProjects: getShowcasedProjects,
			prev: prev,
			next: next,
			open: open,
			close: close,
			handler: handler
		};

	}());

	// Main nav
	var navigation = (function navigation() {

		var nav = document.getElementById('nav'),
			navItems = nav.getElementsByClassName('nav__item');

		var goTo = function goTo(target) {

			for (var i = 0; i < navItems.length; i++) {

				navItems[i].classList.remove('is-active');

			}

			target.classList.add('is-active');

		};

		(function _delegateEvents() {

			nav.addEventListener('click', function(e) {

				goTo(e.target);

			});

		}());

		(function _hashToggle() {

			var hash = window.location.hash.substr(1);

			if (hash.length > 0) {

				for (var i = 0; i < navItems.length; i++) {

					if (navItems[i].getAttribute('data-target') === hash) {

						goTo(navItems[i]);

					}

				}

			}

		}());

		return {
			goTo: goTo
		};

	}());

	// Projects grid gallery
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
			Wolfpilot.modal.setShowcasedProjects(showcasedProjects);

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
			Wolfpilot.modal.setShowcasedProjects(showcasedProjects);

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

		(function delegateEvents() {

			// listen for project clicks
			wrapper.addEventListener('click', function(e) {

				/* Stop the modal from opening on window width/height smaller than 480px
				 * as there's no point in opening the modal for devices that are so small
				 */
				if (Wolfpilot.windowSize.getDimensions().wWidth >= 480 && Wolfpilot.windowSize.getDimensions().wHeight >= 480) {

					if (e.target.classList.contains('showcase__project-details')) {

						var project = Wolfpilot.getClosestParent(e.target, '.js-showcase-project'),
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

		}());

		document.addEventListener('DOMContentLoaded', function init() {

			// Get the showcased projects list
			showCategory(category);

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
		/** Helpers */
		windowSize: windowSize,
		getClosestParent: getClosestParent,
		lazyload: lazyload,
		/** MAIN */
		navigation: navigation,
		scrollToY: scrollToY,
		overlay: overlay,
		modal: modal,
		showcase: showcase
	};

}());
