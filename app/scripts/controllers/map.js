angular.module('doctorpricerWebApp')
	.controller('MapController', function($scope, $timeout, leafletData, PracticesCollection) {
		var directionsService = new google.maps.DirectionsService();

	    /* Initializes the map with all the markers and sets the size properly */
		var initializeMap = function(callback) {
			$scope.markers = {
	            start: {
	            	title: "You",
	            	icon: local_icons.markerBlue,
	            	lat: PracticesCollection.displayCollection[PracticesCollection.selectedPractice].start.k,
	            	lng: PracticesCollection.displayCollection[PracticesCollection.selectedPractice].start.D,
	            }
		   	}

	        $timeout(function() {
	            var mapHeight = (PracticesCollection.screenHeight - 300) + 'px';
	                document.getElementById("leaflet_map").style.height = mapHeight;
	                document.getElementById("map_canvas").style.maxHeight = mapHeight;
	                leafletData.getMap().then(function(map) {
	                    map.invalidateSize();
	                    angular.forEach(PracticesCollection.displayCollection, function(value, key) {
						$scope.markers[value.name.split("-").join('')] = {
							title: value.name,
							message: value.name,
							draggable: false,
							lat: value.end.k,
							lng: value.end.D,
							icon: local_icons.markerRed
						}
					});
	                callback();
	            });
	        }, 100);
	    }

	    /* Updates the map with the current route and bounds to fit it in */
	    var updateMap = function() {
			setDirections(function() {
				var bounds = L.latLngBounds([PracticesCollection.displayCollection[PracticesCollection.selectedPractice].end.k, PracticesCollection.displayCollection[PracticesCollection.selectedPractice].end.D], [PracticesCollection.displayCollection[PracticesCollection.selectedPractice].start.k, PracticesCollection.displayCollection[PracticesCollection.selectedPractice].start.D])
				leafletData.getMap().then(function(map) {
					$scope.markers[PracticesCollection.displayCollection[PracticesCollection.selectedPractice].name.split("-").join('')].focus = true;
					map.fitBounds(bounds, {padding: [50, 50]});
	            });
	        })
		}

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
	            	}
	            	callback();
	            } else {
	            	// Handle this error
	            	console.log('Error when fetching route: ' + status);
	            }
	        });
	    }

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
	   	var local_icons = {
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
	   	}

	   	$scope.$on('countUpdated', function() {
			initializeMap(function() {
				updateMap();
			});
		})

		$scope.$on('changePractice', function() {
			updateMap();
		})
	});