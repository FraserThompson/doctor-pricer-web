'use strict';

/**
 * @ngdoc function
 * @name doctorpricerWebApp.services:SearchModel
 * @description
 * # SearchModel
 * Service for sharing the users search data between controllers.
 */

angular.module('doctorpricerWebApp')
	.service('SearchModel', function($rootScope) {
		var self = this;
		this.address = 'None';
		this.displayAddress = 'Address';
		this.age = 0;
		this.coords = [];

		this.initalizeModel = function(lat, lng, age, successCallback, failCallback) {
			this.age = age;
			this.coords = [lat, lng];
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

					successCallback();
				} else {
					failCallback('Error geocoding input address.');
				}
			});
		};
	});