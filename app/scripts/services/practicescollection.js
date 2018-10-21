'use strict';

/**
 * @ngdoc function
 * @name doctorpricerWebApp.services:self
 * @description
 * # self
 * Service for sharing practice collection data between controllers, and provides methods for processing it.
 */

angular.module('doctorpricerWebApp')
	.service('PracticesCollection', ['$q', '$http', '$timeout', '$rootScope', function($q, $http, $timeout, $rootScope) {
		var service = new google.maps.places.PlacesService(document.createElement('div'));
		var self = this;

		this.length = 0;
		this.lastPractice = undefined;
		this.displayCollection = [];
		this.selectedPractice = undefined;
		this.christchurch = false;

		this.getPlaceId = function(place_id, id){
			var defer = $q.defer();

			if (place_id == null) {
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
						defer.resolve(result[0].place_id);
					} else {
						defer.reject('Error finding place');
					}
				});
			} else {
				defer.resolve();
			}

			return defer.promise;
		}

		/* Gets google reviews for a place */
		this.getGoogle = function(id) {
			var defer = $q.defer();
			var place_id = self.displayCollection[id]['place_id'] || null;

			// if we found no place_id during scraping then try it now
			self.getPlaceId(place_id, id)
				.then(function(result) {
					if(result){
						place_id = result;
					}
					// get the actual details
					service.getDetails({'placeId': place_id}, function(result, status){
						if (status == google.maps.places.PlacesServiceStatus.OK) {
							defer.resolve(result);
						} else {
							defer.reject('Error fetching place details from Google');
						}
					});
				});
			
			return defer.promise;
		}

		/* Fetches the data from the JSON via a promise*/
		this.fetchData = function(lat, lng, age) {
			var defer = $q.defer();

			$timeout(function() {
				defer.reject('Timeout getting practices from API, maybe it is broken.');
			}, 15000)

			$http.get($rootScope.apiUrl + '/dp/api/practices?lat=' + lat + '&lng=' + lng + '&age=' + age + '&sort=1')
				.then(function(response) {
						self.collection = response.data;
						console.log("[PRACTICESCOLLECTION] Got " + response.data.length + " practices from API.");
						defer.resolve(response.data);
					},
					function(error) {
						defer.reject('Error getting practices from API: ' + error);
					}
				);
			return defer.promise;
		};

		this.sortData = function(data) {

			// The radiuses supported. This is used to sort the practices into buckets.
			var sortedPractices = [
				{
					"name": "2km", 
					"distance": 2000, 
					"practices": []
				},
				{	
					"name": "5km", 
					"distance": 5000, 
					"practices":[]
				}, 
				{
					"name": "10km", 
					"distance": 10000, 
					"practices": []
				}, 
				{	
					"name": "30km", 
					"distance": 30000, 
					"practices": []
				}, 
				{	
					"name": "60km", 
					"distance": 60000, 
					"practices": []
				}
			];

            // sort into radius buckets (not super happy about any of this fyi)
            for (var i = 0; i < sortedPractices.length; i++){

                var curr_radius_distance = sortedPractices[i].distance;

                // All arrays include previous arrays
                if (i != 0) sortedPractices[i]["practices"].push.apply(sortedPractices[i]["practices"], sortedPractices[i - 1]["practices"]);

                for (var j = 0; j < data.length; j++){
                    
                    var practice_distance = data[j].distance;

                    // If we're getting too far then go to next radius
                    if (practice_distance > curr_radius_distance) break;

                    // Put the practice in it's radius bucket and remove it from the main collection so it's faster
                    sortedPractices[i]["practices"].push(data[j]);
                    data.splice(j, 1);
                    j = j - 1;

                }
            }

            console.log("[PRACTICESCOLLECTION] Sorted the result into buckets.");

            // a second for loop to remove empty ones and duplicates (this REALLY SUCKS)
            for (var i = sortedPractices.length - 1; i >= 0; i--){
                if (sortedPractices[i].practices.length === 0 || (i > 0 && sortedPractices[i].practices.length === sortedPractices[i - 1].practices.length)) {
					sortedPractices.splice(i, 1);
				}
			}

			console.log("[PRACTICESCOLLECTION] Removed empties and duplicates.");

			this.sortedPractices = sortedPractices;
			
			this.changeRadius(0);
			
			this.selectedPractice = undefined;

			return sortedPractices;
		};

		this.changeRadius = function(index) {
			this.displayCollection = this.sortedPractices[index]["practices"];
			this.displayCollection.sort(compare);
			$rootScope.$broadcast('countUpdated');
		}

		/* Simple comparison function */
		var compare = function(a,b) {
			if (a.price < b.price) return -1;
			if (a.price > b.price) return 1;
			return 0;
		};

	}]);