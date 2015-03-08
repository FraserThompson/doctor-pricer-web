'use strict';

/**
 * @ngdoc function
 * @name doctorpricerWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the doctorpricerWebApp
 */
angular.module('doctorpricerWebApp')
  .controller('MainCtrl', function ($scope, $rootScope, $window, $state, $timeout) {
  	$scope.options = {
  		country: 'nz'
  	};
    $scope.details = {};
    
    if ($window.innerWidth > 545) {
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
      if (!$scope.details.geometry || $scope.form.$invalid) {
        return; 
      }
      $state.go('result', {
        'age': $scope.age, 
        'lat':$scope.details.geometry.location.k, 
        'lng':  $scope.details.geometry.location.D,
      });
    };
  });
