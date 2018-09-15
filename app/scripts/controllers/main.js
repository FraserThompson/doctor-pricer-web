'use strict';

/**
 * @ngdoc function
 * @name doctorpricerWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the doctorpricerWebApp
 */
angular.module('doctorpricerWebApp')
  .controller('MainCtrl', ['$scope', '$rootScope', '$window', '$state', '$timeout', 'SearchModel', function ($scope, $rootScope, $window, $state, $timeout, SearchModel) {
  	$scope.options = {
  		country: 'nz'
  	};
    $scope.error = "";
    $scope.details = {};
    
    if ($window.outerWidth > 545) {
      $scope.addressPlaceholder = "Start typing an address"
    } else {
      $scope.addressPlaceholder = "Address"
    }
    /* Associate the details found with the text submitted so input validation is easier */
    $scope.$watch('details', function() {
      $timeout(function() {
        $scope.details.autocomplete = $scope.autocomplete;
      }, 200);
    });

    /* Used for the submit button */
  	$scope.next = function() {

      $scope.$broadcast('show-errors-check-validity');
      if (!$scope.details.geometry || $scope.form.$invalid) { $scope.isLoading = false; return;}
      $scope.error = "";

      // Get the stuff in the search model
      SearchModel.initalizeModel(
        $scope.details.geometry.location.lat(),
        $scope.details.geometry.location.lng(),
        $scope.age,
        $scope.details.address_components[0].short_name + ' ' + $scope.details.address_components[1].short_name + ', ' + $scope.details.address_components[2].short_name + ', ' + $scope.details.address_components[3].short_name,
        $scope.details.address_components[0].short_name + ' ' + $scope.details.address_components[1].short_name
      );

      $rootScope.$broadcast('geolocatedAddress');

      $state.go('result', {
        'age': SearchModel.age, 
        'lat': SearchModel.coords[0], 
        'lng': SearchModel.coords[1]
      })
      .then(function() {console.log("Here we are, stuck by this river.")}, function() {
        $scope.error = "Something's broken :( Try again later.";
        $scope.isLoading = false;
      });

    };

  }]);
