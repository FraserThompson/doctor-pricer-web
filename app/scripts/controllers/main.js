'use strict';

/**
 * @ngdoc function
 * @name doctorpricerWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the doctorpricerWebApp
 */
angular.module('doctorpricerWebApp')
  .controller('MainCtrl', function ($scope, $rootScope, $location, $timeout, PracticesCollection) {
    var self = this;
    $rootScope.title = "DoctorPricer";
  	$scope.options = {
  		country: 'nz'
  	};
    $scope.details = {};

    /* Associate the details found with the text submitted so input validation is easier */
    $scope.$watch('details', function() {
      $timeout(function() {
        $scope.details.autocomplete = $scope.autocomplete
      }, 200);
    })

    /* Used for the submit button */
  	$scope.next = function() {
      $scope.$broadcast('show-errors-check-validity');
      if (!$scope.details.geometry) { return; }
      if ($scope.form.$invalid) { return; }
      $location.path('result/' + $scope.details.geometry.location.k + ',' + $scope.details.geometry.location.D + '/' + $scope.age, true);
    }
  });
