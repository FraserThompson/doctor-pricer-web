'use strict';

/**
 * @ngdoc function
 * @name doctorpricerWebApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the doctorpricerWebApp
 */
angular.module('doctorpricerWebApp')
  .controller('ResultCtrl', function ($scope, $routeParams, $rootScope, $timeout, leafletData, PracticesCollection, SearchModel) {
  	$scope.practices = PracticesCollection.displayCollection;
  	$scope.practiceCount = PracticesCollection.length;
  	$scope.radiuses = [
		{id: 2, name: '2km'},
		{id: 5, name: '5km'},
		{id: 10, name: '10km'},
		{id: 15, name: '15km'},
	];

	$scope.$on('countUpdated', function() {
		$scope.practiceCount = PracticesCollection.length;
	})

  	/* Fetch data from JSON and then filter it */
  	PracticesCollection.fetchData(function() {
		PracticesCollection.filterCollection([$routeParams.lat, $routeParams.lng], $routeParams.age);
		PracticesCollection.changeRadius(2);
		$scope.thisPractice = PracticesCollection.displayCollection[0];
  	})

  	/* Calculate address from parameter values and set title */
	SearchModel.calculateAddress($routeParams.lat, $routeParams.lng, $routeParams.age, function() {
		$rootScope.$apply(function() {
			$rootScope.title = "DoctorPricer - " + SearchModel.displayAddress;
		})
	}, function() {
		console.log('fail');
		// handle this error
	})

	/* Calls the changeRadius method from the collection when user does that */
	$scope.changeRadius = function(distance) {
		PracticesCollection.changeRadius(distance);
	};

	/* Changes the selected practice and updates the map when user does that */
	$scope.navPractice = function(id) {
		PracticesCollection.selectedPractice = id;
		$rootScope.$broadcast('changePractice');
		$scope.thisPractice = PracticesCollection.displayCollection[PracticesCollection.selectedPractice]
	};

	/* Used to determine if an item is active */
	$scope.isActive = function(id) {
    	return id == PracticesCollection.selectedPractice;
    };
  });
