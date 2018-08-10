'use strict';

require('angular');

/**
 * @ngdoc function
 * @name doctorpricerWebApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller for handling things on the Navbar
 */

angular.module('doctorpricerWebApp')
  .controller('NavbarCtrl', function ($scope, $rootScope, $location, $state, $timeout, SearchModel) {
  	$scope.age = SearchModel.age;
  	$scope.autocomplete = SearchModel.displayAddress;
  	$scope.options = {
  		country: 'nz'
  	};
    $scope.details = {};
    $scope.isCollapsed = 1;

    /* Used to decide whether navbarThings should be displayed based on the state*/
  	$scope.$on('$stateChangeSuccess', function(event, next) {
  		if (next.name === 'result') {
  			$scope.navbarThings = 1;
  		} else {
  			$scope.navbarThings = 0;
  		}
  	});

    /* Associate the details found with the text submitted so input validation is easier */
    $scope.$watch('details', function() {
      $timeout(function() {
        $scope.details.autocomplete = $scope.autocomplete;
      }, 200);
    });
  	
  	/* When there's a new search update the values in the search box */
  	$scope.$on('geolocatedAddress', function() {
  		$scope.age = SearchModel.age;
  		$scope.autocomplete = SearchModel.displayAddress;
  		$scope.details.autocomplete = $scope.autocomplete;
  	});

  	/* Update searchmodel and addressbar location, don't trigger state change */
  	$scope.next = function() {
      // Don't bother validating if nothing is changed
      if ($scope.details.geometry) {
    		$scope.$broadcast('show-errors-check-validity');
    		if ($scope.headerForm.$invalid) { return; }
        document.getElementById('practice-list').style.maxHeight = 0;
      }
      $state.transitionTo('result', {
        'age': $scope.age, 
        'lat': $scope.details.geometry ? $scope.details.geometry.location.lat() : SearchModel.coords[0], 
        'lng': $scope.details.geometry ? $scope.details.geometry.location.lng() : SearchModel.coords[1],
      }, {location: true, inherit: true, notify: false});
    };
  });