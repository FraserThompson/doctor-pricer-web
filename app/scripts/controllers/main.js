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
    $scope.csc = "0";
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

    /* On mobile the ad gets pushed up with the keyboard so we just hide it when the form elements are focused */
    $scope.hideAd = function() {
      var element = document.getElementsByClassName('adsbygoogle');
      if (element[0] && $window.outerWidth < 545) element[0].style.display = "none";
    }

    $scope.showAd = function() {
      var element = document.getElementsByClassName('adsbygoogle');
      if (element[0] && $window.outerWidth < 545) element[0].style.display = "block";
    }

    /* Used for the submit button */
  	$scope.next = function() {

      $scope.$broadcast('show-errors-check-validity');
      if (!$scope.details.geometry || $scope.form.$invalid) { $scope.isLoading = false; return;}
      $scope.error = "";

      $scope.showAd();

      $state.go('result', {
        'age': $scope.age,
        'csc': $scope.csc,
        'lat': $scope.details.geometry.location.lat(),
        'lng': $scope.details.geometry.location.lng(),
        'address': $scope.details.formatted_address,
        '#': 'list',
        'display_address': $scope.details.address_components[0].short_name + ' ' + $scope.details.address_components[1].short_name
      })
      .then(
        function() {
          console.log("Here we are, stuck by this river.")
        },
        function() {
          $scope.error = "Something's broken :( Try again later.";
          $scope.isLoading = false;
        }
      );

    };

  }]);
