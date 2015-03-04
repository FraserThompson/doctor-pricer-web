'use strict';

/**
 * @ngdoc function
 * @name doctorpricerWebApp.controller:MapCtrl
 * @description
 * # MapCtrl
 * Controller for displaying stuff on the map.
 */

angular.module('doctorpricerWebApp')
	.controller('MapCtrl', function($scope, $timeout, $rootScope, leafletData, PracticesCollection) {
		var directionsService = new google.maps.DirectionsService();

		/* When there are new practices to put on the map */
	   	$scope.$on('countUpdated', function() {
			initializeMap();
		});

	   	/* When the user selects a different practice on the list */
		$scope.$on('changePractice', function() {
			selectMapItem(true);
		});

		/* When the user clicks a marker */
	    $scope.$on('leafletDirectiveMarker.click', function(e, args) {
	    	if (args.markerName === 'start') { return; }
	    	$scope.navPractice(args.leafletEvent.target.options.id, false);
	    	$rootScope.$broadcast('updateScroll');
	    	selectMapItem(false);
        });

	    /* Initializes the map with all the markers and sets the size properly */
		var initializeMap = function() {
			if (PracticesCollection.displayCollection.length === 0) {return;}
			var latLngs = [];
			$scope.paths = {};
			$scope.markers = {
	            start: {
	            	title: 'You',
	            	icon: localIcons.markerBlue,
	            	lat: PracticesCollection.displayCollection[0].start.k,
	            	lng: PracticesCollection.displayCollection[0].start.D,
	            }
		   	};
		   	latLngs.push([PracticesCollection.displayCollection[0].start.k, PracticesCollection.displayCollection[0].start.D]);
		   // Make a marker for each practice
	        angular.forEach(PracticesCollection.displayCollection, function(value, key) {
				latLngs.push([value.end.k, value.end.D]);
				$scope.markers[value.name.split('-').join('')] = {
					title: value.name,
					message: value.name,
					draggable: false,
					id: key,
					lat: value.end.k,
					lng: value.end.D,
					icon: localIcons.markerRed
				};
			});
			var bounds = L.latLngBounds(latLngs);
			// Wait for animation to finish then expand size of map
		   	$timeout(function() {
	            var mapHeight = (PracticesCollection.screenHeight - 148) + 'px';
                document.getElementById('leaflet_map').style.height = mapHeight;
                document.getElementById('map_canvas').style.maxHeight = mapHeight;
                leafletData.getMap().then(function(map) {
                	map.invalidateSize();
					map.fitBounds(bounds, {padding: [100, 100]});
            	});
	        }, 300);
	    };

		/* Focuses on an item  and calculates a route*/
		var selectMapItem = function(fitBounds) {
			setDirections(function() {
				leafletData.getMap().then(function(map) {
					$scope.markers[PracticesCollection.displayCollection[PracticesCollection.selectedPractice].name.split('-').join('')].focus = true;		
					if (fitBounds) {
						var bounds = L.latLngBounds([PracticesCollection.displayCollection[PracticesCollection.selectedPractice].end.k, PracticesCollection.displayCollection[PracticesCollection.selectedPractice].end.D], [PracticesCollection.displayCollection[PracticesCollection.selectedPractice].start.k, PracticesCollection.displayCollection[PracticesCollection.selectedPractice].start.D]);
						map.fitBounds(bounds, {padding: [100, 100]});
					}
		        });
		    });
		};

	    /* Puts the route on the map */
		var setDirections = function (callback) {
	        var request = {
	            origin: PracticesCollection.displayCollection[PracticesCollection.selectedPractice].start,
	            destination: PracticesCollection.displayCollection[PracticesCollection.selectedPractice].end,
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
	            	callback();
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
	        paths: {},
	        markers: {},
	        scrollWheelZoom: false,
	        layers: {
	        	baselayers: {
	        		osm: {
	        			name: 'OSM',
	        			url: 'http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png',
	        			type: 'xyz',
	        			layerOptions: {
	                        attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/" target="_system">MapQuest</a>',
	                    }
	        		}
	        	}
	        }
	    });

	    /* Icons for markers */
	   	var localIcons = {
	        markerBlue: {
	        	type: 'awesomeMarker',
	        	icon: 'glyphicon-home',
	        	prefix: 'glyphicon',
	        	markerColor: 'blue'
	        },
	       	markerRed: {
	            type: 'awesomeMarker',
	            prefix: 'fa',
	            icon: 'fa-user-md',
	            markerColor: 'red'
	    	}
	   	};
	});