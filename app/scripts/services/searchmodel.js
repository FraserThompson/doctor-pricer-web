'use strict';

/**
 * @ngdoc function
 * @name doctorpricerWebApp.services:SearchModel
 * @description
 * # SearchModel
 * Service for sharing the users search data between controllers.
 */

angular.module('doctorpricerWebApp')
	.service('SearchModel', ['$rootScope', function($rootScope) {
		var self = this;
		this.address = 'None';
		this.displayAddress = 'Address';
		this.age = 'Age';
		this.coords = [];

		/**
		 * Initializes the search model with a new search. Should be called each time a search is done.
		 * 
		 * @param {decimal} lat 
		 * @param {decimal} lng 
		 * @param {int} age 
		 * @param {string} address (optional)
		 * @param {string} displayAddress (optional)
		 * @param {function} successCallback (optional)
		 * @param {function} failCallback (optional)
		 */
		this.initalizeModel = function(lat, lng, age, address, displayAddress, successCallback, failCallback) {

			this.age = age;
			this.coords = [lat, lng];

			// If we don't have an address eg if we're just coming from the URL
			if (!address || !displayAddress) {

				var geocoder = new google.maps.Geocoder();
				var coordsObj = new google.maps.LatLng(lat, lng);

				var geocoderProper = geocoder.geocode({'latLng': coordsObj}, function (results, status) {

					if (status === google.maps.GeocoderStatus.OK) {
						if (results[0].formatted_address.indexOf("Christchurch") > -1) {
							self.christchurch = true;
						} else {
							self.christchurch = false;
						}
						self.address = results[0].address_components[0].short_name + ' ' + results[0].address_components[1].short_name + ', ' + results[0].address_components[2].short_name;
						self.displayAddress = results[0].address_components[0].short_name + ' ' + results[0].address_components[1].short_name;

						$rootScope.$broadcast('geolocatedAddress');

						// take out specific address then send it to analytics
						var anonymousAddress = results[3].formatted_address;
						ga('send', 'pageview', '/results.php?address=' + anonymousAddress + '&age=' + self.age);

						if (successCallback) successCallback();
					} else {
						if (failCallback) failCallback('Error geocoding input address.');
					}

				});
			// If we have an address already
			} else {
				this.address = address;
				this.displayAddress = displayAddress;
	
				if (address.indexOf("Christchurch") > -1) {
					this.christchurch = true;
				} else {
					this.christchurch = false;
				}	
			}

		}

	}]);