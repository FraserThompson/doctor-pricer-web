'use strict';

/**
 * @ngdoc function
 * @name doctorpricerWebApp.services:PracticesCollection
 * @description
 * # PracticesCollection
 * Service for sharing practice collection data between controllers, and provides methods for processing it.
 */

angular.module('doctorpricerWebApp')
	.service('PracticesCollection', function($window, $q, $http, $timeout, $rootScope) {
		var service = new google.maps.places.PlacesService(document.createElement('div'));
		var self = this;
		this.displayCollection =  []; //after filtering for the users radius
		this.length = 0;
		this.lastPractice = undefined;

		this.getGoogle = function(id) {
			var defer = $q.defer();
			var name = self.displayCollection[id]['name'];
			var lat = self.displayCollection[id]['lat'];
			var lng = self.displayCollection[id]['lng'];

			var request = 	
			{	
				'query': name,
				'radius': 0.5,
				'location': new google.maps.LatLng(lat, lng)
			}

			service.textSearch(request, function(result, status) {
				if (status == google.maps.places.PlacesServiceStatus.OK) {
					service.getDetails({'placeId': result[0].place_id}, function(result2) {
						if (status == google.maps.places.PlacesServiceStatus.OK) {
							defer.resolve(result2);
						} else {
							console.log('error fetching place details');
							defer.reject();
						}
					});
				} else {
					console.log('error finding place');
					defer.reject();
				}
			});

			return defer.promise;
		}

		/* Fetches the data from the JSON via a promise*/
		this.fetchData = function(lat, lng, age) {
			var defer = $q.defer();

			$http.get('https://api.doctorpricer.co.nz/api/dp/practices?lat=' + lat + '&lng=' + lng + '&age=' + age + '&radius=15000')
			// $http.get('http://morning-sea-4894.herokuapp.com/api/dp/practices?lat=' + lat + '&lng=' + lng + '&age=' + age + '&radius=15000')
				.success(function(data) {
					self.collection = data.rows;
					// self.collection = data;
					defer.resolve();
				})
				.error(function() {
					defer.reject();
				});
			return defer.promise;
		};

		/* Fetching data the old way */
		this.fetchDataFallback = function() {
			var defer = $q.defer();
			// After 10 seconds the data fails
			var dataFail = function() {
				console.log('data fail');
				defer.reject();
			};
			var dataTimeout = $timeout(dataFail, 10000);
			var url = 'https://fraserthompson.github.io/cheap-practice-finder/data.json.js?callback=JSON_CALLBACK';
			// Succesfull callback returns a good promise and fills the collection
			window.callback = function(data) {
			    $timeout.cancel(dataTimeout);
			    self.collection = data.practices;
			    defer.resolve();
			};
			$http.jsonp(url);
			return defer.promise;
		};

		/* Fires an event when the count is updated so everyone knows */
		var updateCount = function(){
			self.length = self.displayCollection.length;
			$timeout(function() {
				$rootScope.$broadcast('countUpdated');
			}, 250);
		};

		/* Simple comparison function */
		var compare = function(a,b) {
		 	if (a.price < b.price){
		     	return -1;
		  	}
			if (a.price > b.price){
				return 1;
			}
		  return 0;
		};

		/* Public function for filtering to radius */
		this.changeRadius = function(distance) {
			var okay = [];
			angular.forEach (self.collection, function(model) {
				if (model.distance <= distance){
					okay.push(model);
				}
			});
			okay.sort(compare);
			angular.copy(okay, this.displayCollection);
			updateCount();
			self.selectedPractice = undefined;
			self.lastPractice = undefined;
		};
	});