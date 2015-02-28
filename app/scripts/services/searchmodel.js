angular.module('doctorpricerWebApp')
	.service('SearchModel', function($rootScope) {
		var self = this;
		this.address = "None";
		this.displayAddress = "Address";
		this.age = 0;
		this.coords = [];

		this.calculateAddress = function(lat, lng, age, successCallback, failCallback) {
			this.age = age;
			this.coords = [lat, lng];
			var geocoder = new google.maps.Geocoder();
			var coordsObj = new google.maps.LatLng(lat, lng)
			var geocoderProper = geocoder.geocode({'latLng': coordsObj}, function (results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					self.address = results[0].address_components[0]['short_name'] + " " + results[0].address_components[1]['short_name'] + ", " + results[0].address_components[2]['short_name'];
					self.displayAddress = results[0].address_components[0]['short_name'] + " " + results[0].address_components[1]['short_name'];
					$rootScope.$broadcast('newSearch');
					successCallback();
				} else {
					failCallback("Error geocoding input address.");
				}
			});
		}
	});