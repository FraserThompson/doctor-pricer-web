'use strict';

/**
 * @ngdoc function
 * @name doctorpricerWebApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller for handling things on the Navbar
 */

angular.module('doctorpricerWebApp')
  .controller('NavbarCtrl', function ($scope, $rootScope, $location, $state, $timeout, ngDialog, SearchModel) {
  	$scope.age = SearchModel.age;
  	$scope.autocomplete = SearchModel.displayAddress;
  	$scope.options = {
  		country: 'nz'
  	};
    $scope.details = {};
    $scope.details.geometry = {};
    $scope.details.geometry.location = {};

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
  		$scope.details.geometry.location.k = SearchModel.coords[0];
  		$scope.details.geometry.location.D = SearchModel.coords[1];
  		$scope.details.autocomplete = $scope.autocomplete;
  	});

  	/* Opens the modal */
  	$scope.openDialog = function() {
      ngDialog.open({ template: 'views/info.html'});
    };

  	/* Update searchmodel and addressbar location, don't trigger state change */
  	$scope.next = function() {
  		$scope.$broadcast('show-errors-check-validity');
  		if ($scope.headerForm.$invalid) { return; }
  		SearchModel.age = $scope.age;
  		SearchModel.coords = [$scope.details.geometry.location.k, $scope.details.geometry.location.D];
  		$rootScope.$broadcast('newSearch');
      $state.transitionTo('result', {
        'age': $scope.age, 
        'lat':$scope.details.geometry.location.k, 
        'lng':  $scope.details.geometry.location.D,
      }, {location: true, inherit: true, notify: false});
    };
  });