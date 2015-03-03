'use strict';

/**
 * @ngdoc function
 * @name doctorpricerWebApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the doctorpricerWebApp
 */
angular.module('doctorpricerWebApp')
  .controller('ResultCtrl', function ($scope, $routeParams, $rootScope, leafletData, PracticesCollection, SearchModel) {
  	// Update SearchModel stuff upon into it
  	SearchModel.coords = [$routeParams.lat, $routeParams.lng];
  	SearchModel.age = $routeParams.age;

  	// $scope variables
  	$scope.practices = PracticesCollection.displayCollection;
  	$scope.practiceCount = PracticesCollection.length;
  	$scope.userAddress = SearchModel.address;
  	$scope.radiuses = [
		{id: 2, name: '2km'},
		{id: 5, name: '5km'},
		{id: 10, name: '10km'},
		{id: 15, name: '15km'},
	];

	$scope.$on('countUpdated', function() {
		$scope.practiceCount = PracticesCollection.length;
		if (PracticesCollection.displayCollection.length == 0) {
			$scope.noPractices = 1;
		} else {
			$scope.noPractices = 0;
		}
	});

	$scope.$on('newSearch', function() {
    	// If there's no collection fetch it, else just filter the existing one
    	if(PracticesCollection.displayCollection.length == 0) {
    		PracticesCollection.fetchData(function() {
    			PracticesCollection.filterCollection(SearchModel.coords, SearchModel.age, function() {
					PracticesCollection.changeRadius(2);
					$scope.thisPractice = PracticesCollection.displayCollection[0];
    			});
    		});
    	} else {
			PracticesCollection.filterCollection(SearchModel.coords, SearchModel.age, function() {
				PracticesCollection.changeRadius(2);
				$scope.thisPractice = PracticesCollection.displayCollection[0];
			});
		};

		SearchModel.calculateAddress(SearchModel.coords[0], SearchModel.coords[1], SearchModel.age, function() {
			$rootScope.$apply(function() {
				$rootScope.title = "DoctorPricer - " + SearchModel.displayAddress;
			})
			$scope.userAddress = SearchModel.address;
		}, function() {
			console.log('calculating address failed');
			// handle this error
		})
    });

    // Upon into the view we should do that
    $rootScope.$broadcast('newSearch');

	/* Calls the changeRadius method from the collection when user does that */
	$scope.changeRadius = function(distance) {
		PracticesCollection.changeRadius(distance);
	};

	/* Changes the selected practice and updates the map when user does that */
	$scope.navPractice = function(id, eventBroadcast) {
		PracticesCollection.selectedPractice = id;
		$scope.thisPractice = PracticesCollection.displayCollection[PracticesCollection.selectedPractice]
		if (eventBroadcast) {
			$rootScope.$broadcast('changePractice');
		}
	};

	/* Used to determine if an item is active */
	$scope.isActive = function(id) {
    	return id == PracticesCollection.selectedPractice;
    };

  });
