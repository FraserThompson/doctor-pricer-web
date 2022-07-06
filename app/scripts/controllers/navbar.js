'use strict';

/**
 * @ngdoc function
 * @name doctorpricerWebApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller for handling things on the Navbar
 */

angular.module('doctorpricerWebApp')
  .controller('NavbarCtrl', ['$scope', '$rootScope', '$state', '$timeout', 'SearchModel', function ($scope, $rootScope, $state, $timeout, SearchModel) {
  	$scope.age = 'SearchModel.age';
    $scope.csc = SearchModel.csc;
  	$scope.autocomplete = 'SearchModel.displayAddress';
  	$scope.options = {
  		country: 'nz'
  	};
    $scope.details = {};
    $scope.isCollapsed = 1;

    /* Used to decide whether navbarThings should be displayed based on the state*/
  	$scope.$on('$stateChangeSuccess', function(event, next) {
  		if (next.name === 'result') {
				$scope.navbarThings = 1;
				$scope.age = SearchModel.age;
        $scope.csc = SearchModel.csc;
				$scope.autocomplete = SearchModel.displayAddress;
				$scope.details.autocomplete = $scope.autocomplete;
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

  	/* Update searchmodel and addressbar location */
  	$scope.next = function() {

      // Don't bother validating if nothing is changed
      if ($scope.details.geometry) {
    		$scope.$broadcast('show-errors-check-validity');
    		if ($scope.headerForm.$invalid) return;
				document.getElementById('practice-list').style.maxHeight = 0;
			}

			$scope.isCollapsed = 1;
      $state.go('result', {
        'age': $scope.age,
        'csc': $scope.csc,
        'lat': $scope.details.geometry ? $scope.details.geometry.location.lat() : SearchModel.coords[0],
				'lng': $scope.details.geometry ? $scope.details.geometry.location.lng() : SearchModel.coords[1],
				'address': $scope.details.formatted_address ? $scope.details.formatted_address : SearchModel.address,
				'display_address': $scope.details.address_components ? $scope.details.address_components[0].short_name + ' ' + $scope.details.address_components[1].short_name : SearchModel.displayAddress,
				'#': 'list'
			})
			.then(
        function() {
					console.log("Here we are, stuck by this river.")
					$scope.isLoading = false;
        },
        function() {
          $scope.error = "Something's broken :( Try again later.";
          $scope.isLoading = false;
        }
      );

    };
  }]);
