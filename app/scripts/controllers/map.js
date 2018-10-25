'use strict';

require('polyline-encoded');
require('Leaflet.awesome-markers/dist/leaflet.awesome-markers.js');
require('Leaflet.awesome-markers/dist/leaflet.awesome-markers.css');

/**
 * @ngdoc function
 * @name doctorpricerWebApp.controller:MapCtrl
 * @description
 * # MapCtrl
 * Controller for displaying stuff on the map.
 */

angular.module('doctorpricerWebApp')
	.controller('MapCtrl', ['$scope', '$timeout', '$rootScope', '$window', 'leafletData', 'PracticesCollection', 'SearchModel', function($scope, $timeout, $rootScope, $window, leafletData, PracticesCollection, SearchModel) {
		var directionsService = new google.maps.DirectionsService();
		var markersLayer;

		var getPracticeMarker = function(price) {
			return new L.DivIcon({
				iconSize: [35, 45],
				iconAnchor:   [17, 42],
				popupAnchor: [1, -32],
				shadowAnchor: [10, 12],
				shadowSize: [36, 16],
				className: 'awesome-marker awesome-marker-icon-red leaflet-zoom-animated leaflet-interactive map-icon-practice',
				markerColor: 'red',
				iconColor: 'white',
				html: '<span class="map-icon-text">$' + price + '</span>'
			});
		}

		/* Listeners */
		/* Sets the height of the map when window is resized */
		var w = angular.element($window)
		var setHeight = function() {
			 $timeout(function() {
				var mapElement = document.getElementById('leaflet_map');
				var mapCanvasElement = document.getElementById('map_canvas');

				if (mapElement){
					var mapHeight = ($window.innerHeight - 115) + 'px';
					mapElement.style.height = mapHeight;
					mapCanvasElement.style.maxHeight = mapHeight;
				}

		     }, 300);
		};

		w.bind('resize', function() {
			setHeight();
		});

		$scope.$watch('$viewContentLoaded', function(){
			initializeMap();
		 });

		/* When there are new practices to put on the map */
	   	$rootScope.$on('countUpdated', function() {
			initializeMap();
		});

	   	/* Do things to the map for a practice change */
		$scope.$on('changePractice', function() {
			setDirections();
			fitBounds(function() {
				PracticesCollection.displayCollection[PracticesCollection.selectedPractice].marker.openPopup(); 
			});
		});

		/* Puts route on map when user clicks marker*/
		var markerClick = function(marker, id) {
	    	$scope.navPractice(id, false);
			setDirections();
	    	$rootScope.$broadcast('updateScroll');
		}

	    /* Initializes the map with all the markers and sets the size properly */
		var initializeMap = function() {
			if (PracticesCollection.displayCollection.length === 0) {return;}
			setHeight();
			var latLngs = [];
			$scope.paths = {};

			var markers = [];
			var start = L.marker([SearchModel.coords[0], SearchModel.coords[1]], {
            	'title': 'You',
            	'icon': L.AwesomeMarkers.icon({
					prefix: 'glyphicon',
					icon: 'glyphicon-home',
					markerColor: 'blue'
				})
            });

			markers.push(start);
		   	latLngs.push([SearchModel.coords[0], SearchModel.coords[1]]);

		   // Make a marker for each practice
	        angular.forEach(PracticesCollection.displayCollection, function(value, key) {
				latLngs.push([value.lat, value.lng]);
				var marker = L.marker([parseFloat(value.lat), parseFloat(value.lng)], {
					'title': value.name,
					'icon': getPracticeMarker(value.price)
				});
				marker.bindPopup('<h5><a href="' + value.url + '" target="_blank">' + value.name + '</a><br><small>' + value.phone + '</small><br><small>' + value.pho + '</small></h5>')
				marker.on('click', function(e) { markerClick(marker, key); });
				PracticesCollection.displayCollection[key]['marker'] = marker;
				markers.push(marker);
			});

			var bounds = L.latLngBounds(latLngs);
			// Wait for animation to finish then get the map and touch it with your magic fingers
		   	$timeout(function() {
                leafletData.getMap('leaflet_map').then(function(map) {
                	if (markersLayer){map.removeLayer(markersLayer);};
                	markersLayer = L.featureGroup(markers)
					map.addLayer(markersLayer)
					map.invalidateSize();
					map.fitBounds(bounds, {padding: [80, 80]});
            	});
	        }, 300);
	    };

		/* Fits the maps to specified bounds */
		var fitBounds = function(callback) {
			leafletData.getMap('leaflet_map').then(function(map) {
				var bounds = L.latLngBounds([PracticesCollection.displayCollection[PracticesCollection.selectedPractice].lat, PracticesCollection.displayCollection[PracticesCollection.selectedPractice].lng],
					[SearchModel.coords[0], SearchModel.coords[1]]);
				map.fitBounds(bounds, {padding: [60, 60]});
				callback();
			});
		}

	    /* Puts the route on the map */
		var setDirections = function () {
			var destination = new google.maps.LatLng(PracticesCollection.displayCollection[PracticesCollection.selectedPractice].lat, PracticesCollection.displayCollection[PracticesCollection.selectedPractice].lng);
			var origin = new google.maps.LatLng(SearchModel.coords[0], SearchModel.coords[1]);
	        var request = {
	            origin: origin,
	            destination: destination,
	            travelMode: google.maps.TravelMode.DRIVING,
	            unitSystem: google.maps.UnitSystem.METRIC,
	            optimizeWaypoints: true
	        };

	        directionsService.route(request, function (response, status) {
	            if (status === google.maps.DirectionsStatus.OK) {
	            	var latlngs = L.Polyline.fromEncoded(response.routes[0].overview_polyline).getLatLngs();
	            	$scope.paths.p1 = {
	            		color: '#387ef5', 
	            		weight: 6,
	            		latlngs: latlngs,
	            		type: 'polyline'
	            	};
	            } else {
	            	// Handle this error
	            	console.log('Error when fetching route: ' + status);
	            }
	        });
	    };

	    /* Stuff to initialize the map with */
	    angular.extend($scope, {
			center: {
				lat: 0,
				lng: 0,
				zoom: 10
			},
			// markers: {},
	        paths: {},
	        scrollWheelZoom: false,
	        tiles: {
				name: 'MapBox',
				url: 'https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/{z}/{x}/{y}?access_token={apikey}',
				type: 'xyz',
				options: {
					attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>',
					apikey: 'pk.eyJ1IjoiZnJhc2VydGhvbXBzb24iLCJhIjoiY2llcnF2ZXlhMDF0cncwa21yY2tyZjB5aCJ9.iVxJbdbZiWVfHItWtZfKPQ'
				}
	        }
	    });

	}]);