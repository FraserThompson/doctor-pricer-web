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
		var self = this;
		this.screenHeight = $window.innerHeight;
		this.filteredCollection = []; //after filtering out distances over 15
		this.displayCollection =  []; //after filtering for the users radius
		this.length = 0;

		/* Fetches the data from the JSON via a promise*/
		this.fetchData = function() {
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

		/* Get the price from each practice for the age */
		var getPrice = function(age, prices) {
			if (!prices || prices.length === 0){
				return 1000;
			}
			for (var i = 0; i < prices.length - 1; ++i){
				if (age >= prices[i].age && age < prices[i+1].age){
					break;
				}
			}
			return prices[i].price;
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
			angular.forEach (self.filteredCollection, function(model) {
				if (model.distance <= distance){
					okay.push(model);
				}
			});
			okay.sort(compare);
			angular.copy(okay, this.displayCollection);
			updateCount();
		};

		/* Public function to filter all the 700 or so practices to only ones within 15km */
		this.filterCollection = function(coord, age, callback) {
			self.filteredCollection = [];
			angular.forEach(self.collection, function(val) {
				val.start = new google.maps.LatLng(coord[0], coord[1]);
				val.end = new google.maps.LatLng(val.coordinates[0], val.coordinates[1]);
				var distanceBetween = google.maps.geometry.spherical.computeDistanceBetween(val.start, val.end);
				val.distance = distanceBetween/1000;
				val.price = getPrice(age, val.prices);
				if (val.distance <= 15){
					self.filteredCollection.push(val);
				}
			});
			callback();
		};
	});