'use strict';

/**
 * @ngdoc function
 * @name doctorpricerWebApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller for handling things on the Navbar
 */

angular.module('doctorpricerWebApp')
  .controller('NavbarCtrl', ['$scope', '$state', '$timeout', 'SearchModel', function ($scope, $state, $timeout, SearchModel) {
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
    		if ($scope.headerForm.$invalid) return;
				document.getElementById('practice-list').style.maxHeight = 0;
					
				// Get the stuff in the search model
				SearchModel.initalizeModel(
					$scope.details.geometry.location.lat(),
					$scope.details.geometry.location.lng(),
					$scope.age,
					$scope.details.formatted_address,
					$scope.details.address_components[0].short_name + ' ' + $scope.details.address_components[1].short_name,
				);

				$scope.$broadcast('geolocatedAddress');

			}

			$scope.isCollapsed = 1;
      $state.transitionTo('result', {
        'age': $scope.age, 
        'lat': $scope.details.geometry ? $scope.details.geometry.location.lat() : SearchModel.coords[0], 
        'lng': $scope.details.geometry ? $scope.details.geometry.location.lng() : SearchModel.coords[1],
			}, {location: true, inherit: true, notify: false});

    };
  }]);