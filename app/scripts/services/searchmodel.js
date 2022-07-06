'use strict';

/**
 * @ngdoc function
 * @name doctorpricerWebApp.services:SearchModel
 * @description
 * # SearchModel
 * Service for sharing the users search data between controllers.
 */

angular.module('doctorpricerWebApp')
	.service('SearchModel', ['$q', function($q) {

		var self = this;

		this.address = 'None';
		this.displayAddress = 'Address';
		this.age = 'Age';
    this.csc = 0;
		this.coords = undefined;

		this.checkForChristchurch = function(string) {
			if (string.indexOf("Christchurch") > -1) {
				return true;
			} else {
				return false;
			}
		}

		/**
		 * Initializes the search model with a new search. Should be called each time a search is done.
		 *
		 * @param {decimal} lat
		 * @param {decimal} lng
		 * @param {int} age
     * @param {boolean} csc
		 * @param {string} address (optional)
		 * @param {string} displayAddress (optional)
		 * @param {function} successCallback (optional)
		 * @param {function} failCallback (optional)
		 */
		this.initalizeModel = function(lat, lng, age, csc, address, displayAddress) {
			var defer = $q.defer();

			if (typeof lat == "string" || typeof lng == "string") {
				this.coords = [parseFloat(lat), parseFloat(lng)];
			} else {
				this.coords = [lat, lng];
			}

			this.age = age;
      this.csc = csc;

			// If we don't have an address eg if we're just coming from the URL
			if (!address || !displayAddress) {

				console.log("[SEARCHMODEL] No address, looks like I'll have to geocode it I guess.");

				var geocoder = new google.maps.Geocoder();
				var coordsObj = new google.maps.LatLng(lat, lng);

				var geocoderProper = geocoder.geocode({'latLng': coordsObj, region: 'NZ'}, function (results, status) {

					if (status === google.maps.GeocoderStatus.OK) {
						self.christchurch = self.checkForChristchurch(results[0].formatted_address);
						self.displayAddress = results[0].address_components[0].short_name + ' ' + results[0].address_components[1].short_name;
						self.address = results[0].formatted_address;

						// take out specific address then send it to analytics
						var anonymousAddress = results[3].formatted_address;
						ga('send', 'pageview', '/results.php?address=' + anonymousAddress + '&age=' + self.age);

						defer.resolve();
					} else {
						defer.reject('Error geocoding input address.');
					}

				});
			// If we have an address already
			} else {

				console.log("[SEARCHMODEL] Thanks for the address, that means I don't have to geocode it.");

				this.address = address;
				this.displayAddress = displayAddress;
				this.christchurch = this.checkForChristchurch(address);

				defer.resolve();

			}

			return defer.promise;

		}

	}]);
