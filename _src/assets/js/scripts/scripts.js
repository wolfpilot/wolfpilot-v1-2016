/** Stuffz */

var Wolfpilot = window.Wolfpilot || {};

Wolfpilot = (function() {

	'use strict';

	/** HELPERS */

	// Pub / sub (Observer) decoupling function
	var pubSub = (function pubSub() {
		// Credits go to Addy Osmani for most of the code below

		/* (Possible) real-life example use case:

		 * Create subscriber / observer

			var subscriber = function(topics, data){
			    console.log('Currently on ' + topics + ': ' + data );
			};

		 * Add function to the list of subscribers on the topic of 'Spotify'
		 * This enables the subscriber to listen to any data changes on the topic

			var subscription = Wolfpilot.pubSub.subscribe('Spotify', subscriber);

		 * Check the topics list

		 	Wolfpilot.pubSub.getTopics();

		 * Publish / emit some data to the topic 'Spotify'
		 * The subscribers of this topic will now be made aware of the data change

			Wolfpilot.pubSub.publish('Spotify', 'Hello! Is it me you\'re looking for?'); // * drama *

		 * Remove original subscriber

			Wolfpilot.pubSub.unsubscribe('0'); // arg needs to be a string!!!

		 * Ensure that the subscriber's been removed

		 	Wolfpilot.pubSub.getTopics();

		 * Sudden thought process: the pub / sub pattern helps separate concerns:
		 * the subscribers only React (ha!) to the Flow (ha#2 and sudden Eurika moment) of the data,
		 * whilst the pubSub function itself is only concerned with handling said data!
		 *
		 * Amazing, if only I'd invented this pattern * sigh *
		 */

		var topics = {},
			subID = -1;

		// Simple getter to facilitate debugging
		var getTopics = function getTopics() {

			return topics;

		};

		/* Publish data
		 * @topic: Topic to be published
		 * @data: Arguments passed to the subscribers
		 */
		var publish = function publish(topic, data) {

			if (!topics[topic]) {
				return false;
			}

			setTimeout(function() {

				var subscribers = topics[topic],
					len = subscribers ? subscribers.length : 0;

				while (len--) {
					subscribers[len].func(topic, data);
				}

			}, 0);

			return true;

		};

		/* Unsubscribe listener from topic using unique token
		 * NOTE: The token specifies the function to be unsubscribed
		 */
		var unsubscribe = function unsubscribe(token) {
			// Loop through each topic
			for (var i in topics) {
				// If a topic exists
				if (topics[i]) {
					// Loop through each subscriber of the topic
					for (var j = 0; j < topics[i].length; j++) {
						// If the subscriber of the topic has the same token as the one we passed
						if (topics[i][j].token === token) {
							// Remove subscriber
							topics[i].splice(j, 1);
							// and return its token
							return token;

						}

					}

				}

			}

			return false;

		};

		/* Subscribe listeners to topic
		 * @topic: Topic to subscribe to
		 * @func: Function to be called when a new topic is published
		 */
		var subscribe = function subscribe(topic, func) {

			if (!topics[topic]) {
				topics[topic] = [];
			}

			// Unique token used to identify the function
			var token = (++subID).toString();

			// Store both token and function
			topics[topic].push({
				token: token,
				func: func
			});

			return token;

		};

		return {
			getTopics: getTopics,
			publish: publish,
			subscribe: subscribe,
			unsubscribe: unsubscribe
		};

	}());

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
			size = [],
			timeout = false,
			delay = 250; // time to wait before running the callback

		var _setDimensions = function _setDimensions() {

			wWidth = window.innerWidth;
			wHeight = window.innerHeight;

			size.width = window.innerWidth;
			size.height = window.innerHeight;

			Wolfpilot.pubSub.publish('Window size', size);

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

		document.addEventListener('DOMContentLoaded', function init() {

			_setDimensions();

		});

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

		if (!document.getElementById('js-modal')) {
			return false;
		}

		var wrapper = document.getElementById('js-modal'),
			images = wrapper.getElementsByClassName('modal__img'),

			btnPrev = document.getElementById('js-modal--prev'),
			btnNext = document.getElementById('js-modal--next'),
			btnClose = document.getElementById('js-modal--close'),

			status = 'closed',

			showcasedProjects,
			activeProject = [],
			prevProject,
			nextProject;

		var getStatus = function getStatus() {

			return status;

		};

		var getShowcasedProjects = function getShowcasedProjects() {

			return showcasedProjects;

		};

		var getActiveProject = function getActiveProject() {

			return activeProject;

		};

		var prev = function prev() {

			var i;

			// Go to the previous slide unless we've reached the first one
			if (showcasedProjects[activeProject.index] !== showcasedProjects[0]) {

				prevProject = document.getElementById(showcasedProjects[activeProject.index - 1]);
				i = activeProject.index - 1;

			} else { // otherwise, loop around

				prevProject = document.getElementById(showcasedProjects[showcasedProjects.length - 1]);
				i = showcasedProjects.length - 1;

			}

			lazyload(prevProject);
			activeProject.el.classList.remove('is-visible');
			prevProject.classList.add('is-visible');

			activeProject.el = prevProject;
			activeProject.index = i;

		};

		var next = function next() {

			var i;

			// Go to the next slide unless we've reached the last one
			if (showcasedProjects[activeProject.index] !== showcasedProjects[showcasedProjects.length - 1]) {

				nextProject = document.getElementById(showcasedProjects[activeProject.index + 1]);
				i = activeProject.index + 1;

			} else { // otherwise, loop around

				nextProject = document.getElementById(showcasedProjects[0]);
				i = 0;

			}

			lazyload(nextProject);
			activeProject.el.classList.remove('is-visible');
			nextProject.classList.add('is-visible');

			activeProject.el = nextProject;
			activeProject.index = i;

		};

		var open = function open() {

			status = 'open';

			overlay.handler();
			wrapper.classList.add('is-active');

			lazyload(activeProject.el);
			activeProject.el.classList.add('is-visible');

		};

		var close = function close() {

			status = 'closed';

			overlay.handler();
			wrapper.classList.remove('is-active');

			for (var i = 0; i < images.length; i++) {

				images[i].classList.remove('is-visible');

			}

		};

		var _handler = function _handler(topic, data) {

			switch (topic) {

			case 'Showcased projects':

				showcasedProjects = data;

				break;

			case 'Active project':

				activeProject.el = data.el;
				activeProject.index = data.index;

				open();

				break;

			default:

				return false;

			}

			return true;

		};

		(function delegateEvents() {

			wrapper.addEventListener('click', function(e) {

				if (e.target === btnClose) {
					close();
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

					close();

				}

			});

		}());

		document.addEventListener('DOMContentLoaded', function init() {

			// Subscribe the _handler method to listen
			// to any changes in the topics below
			Wolfpilot.pubSub.subscribe('Active project', _handler);
			Wolfpilot.pubSub.subscribe('Showcased projects', _handler);

		});

		return {
			getStatus: getStatus,
			getActiveProject: getActiveProject,
			getShowcasedProjects: getShowcasedProjects,
			prev: prev,
			next: next,
			open: open,
			close: close
		};

	}());

	// Main nav
	var navigation = (function navigation() {

		var header = document.getElementById('header'),
			nav = document.getElementById('nav'),
			navItems = nav.getElementsByClassName('nav__item'),
			burger = document.getElementById('js-burger'),
			status = 'closed';

		var open = function open() {

			status = 'open';

			header.classList.add('is-active');

		};

		var close = function close() {

			status = 'closed';

			header.classList.remove('is-active');

		};

		var goTo = function goTo(target) {

			for (var i = 0; i < navItems.length; i++) {

				navItems[i].classList.remove('is-active');

			}

			target.classList.add('is-active');

		};

		var _onResize = function _navOnResize(topic, wSize) {

			// Ensures that the nav and overlay are closed if opening the nav on mobile
			// then turning the phone in landscape mode
			if ((status === 'open') && (wSize.width >= 480)) {

				Wolfpilot.overlay.close();
				close();

			}

		};

		var _handler = function _handler() {

			status === 'closed' ? open() : close();

		};

		(function _delegateEvents() {

			// listen for category changes
			nav.addEventListener('click', function(e) {

				if (e.target.classList.contains('nav__item')) {

					goTo(e.target);

					if (Wolfpilot.windowSize.getDimensions().wWidth < 480) {

						// Add a small delay to smooth out the transition
						setTimeout(function() {

							Wolfpilot.overlay.close();
							close();

						}, 150);

					}

				}

			});

			burger.addEventListener('click', function() {

				Wolfpilot.overlay.handler();
				_handler();

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

		document.addEventListener('DOMContentLoaded', function init() {

			// Subscribe the _handler method to Listen
			// to any changes in the 'Showcased category' topic
			Wolfpilot.pubSub.subscribe('Window size', _onResize);

		});

		return {
			open: open,
			close: close,
			goTo: goTo
		};

	}());

	// Projects grid gallery
	var showcase = (function showcase() {

		if (!document.getElementById('js-showcase')) {
			return false;
		}

		var wrapper = document.getElementById('js-showcase'),
			nav = document.getElementById('js-showcase-nav'),
			navTags = wrapper.getElementsByClassName('showcase__nav-item'),
			projects = wrapper.getElementsByClassName('js-showcase-project'),
			showcasedCategory = 'featured', // set initial category
			showcasedProjects,
			activeProject = [];

		var getShowcasedProjects = function getShowcasedProjects() {

			return showcasedProjects;

		};

		var getShowcasedCategory = function getShowcasedCategory() {

			return showcasedCategory;

		};

		var showCategory = function showCategory(newCategory) {

			showcasedCategory = newCategory;
			showcasedProjects = []; // Reset the array before repopulating it again

			// Setting a timeout allows the visible projects to hide first
			setTimeout(function() {

				for (var i = 0; i < projects.length; i++) {

					var tags = projects[i].getAttribute('data-tag').split(', ');

					for (var j = 0; j < tags.length; j++) {

						if (tags[j] === newCategory) {

							lazyload(projects[i].firstElementChild);
							projects[i].classList.add('is-visible');
							// Update the list of currently visible projects
							showcasedProjects.push(projects[i].getAttribute('data-target'));

						}

					}

				}

			}, 500);

			// Publish the list of currently visible projects
			Wolfpilot.pubSub.publish('Showcased projects', showcasedProjects);

		};

		var showAll = function showAll() {

			showcasedCategory = 'all';
			showcasedProjects = []; // Reset the array before repopulating it again

			// Setting a timeout allows the visible projects to hide first
			setTimeout(function() {

				for (var i = 0; i < projects.length; i++) {

					lazyload(projects[i].firstElementChild);
					projects[i].classList.add('is-visible');
					// Update the list of currently visible projects
					showcasedProjects.push(projects[i].getAttribute('data-target'));

				}
			}, 500);

			// Publish the list of currently visible projects
			Wolfpilot.pubSub.publish('Showcased projects', showcasedProjects);

		};

		var hideAll = function hideAll() {

			for (var i = 0; i < projects.length; i++) {

				projects[i].classList.remove('is-visible');

			}

		};

		var _handler = function _handler(topic, newCategory) {

			hideAll();

			newCategory === 'all' ? showAll() : showCategory(newCategory);

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
								activeProject.el = el;
								activeProject.index = i;
								// Publish the newly-opened project
								Wolfpilot.pubSub.publish('Active project', activeProject);

							}

						}

					}

				}

			});

			// listen for category changes
			nav.addEventListener('click', function(e) {

				if (e.target.classList.contains('showcase__nav-item') && !e.target.classList.contains('is-active')) {

					Wolfpilot.pubSub.publish('Showcased category', e.target.getAttribute('data-category'));

					toggleNav(e.target);

				}

			});

		}());

		document.addEventListener('DOMContentLoaded', function init() {

			// Subscribe the _handler method to Listen
			// to any changes in the 'Showcased category' topic
			Wolfpilot.pubSub.subscribe('Showcased category', _handler);

			// Calling the showCategory method publishes the list of visible projects
			// so that it can be used by the modal before any further category switches
			showCategory(showcasedCategory);

		});


		return {
			getShowcasedProjects: getShowcasedProjects,
			getShowcasedCategory: getShowcasedCategory,
			showCategory: showCategory,
			showAll: showAll,
			hideAll: hideAll,
			toggleNav: toggleNav
		};

	}());

	var videoPlayer = (function videoPlayer() {

		var videos = document.getElementsByClassName('js-video'),
			video,
			player,
			status = 'paused';

		var getStatus = function getStatus() {

			return status;

		};

		var pause = function pause(target) {

			video = Wolfpilot.getClosestParent(target, '.js-video');
			player = video.getElementsByClassName('js-video-player')[0];

			video.classList.remove('is-playing');
			player.pause();

			status = 'paused';

		};

		var play = function play(target) {

			video = Wolfpilot.getClosestParent(target, '.js-video');
			player = video.getElementsByClassName('js-video-player')[0];

			video.classList.add('is-playing');
			player.play();

			status = 'playing';

		};

		var _handler = function _handler(target) {

			status === 'paused' ? play(target) : pause(target);

		};

		(function delegateEvents() {

			for (var i = 0; i < videos.length; i++) {

				videos[i].addEventListener('click', function(e) {

					_handler(e.target);

				});

			}

		}());

		return {
			getStatus: getStatus,
			play: play,
			pause: pause
		};

	}());

	return {
		/** Helpers */
		pubSub: pubSub,
		windowSize: windowSize,
		getClosestParent: getClosestParent,
		lazyload: lazyload,
		/** MAIN */
		navigation: navigation,
		scrollToY: scrollToY,
		overlay: overlay,
		modal: modal,
		showcase: showcase,
		videoPlayer: videoPlayer
	};

}());
