'use strict';

/**
 * @ngdoc function
 * @name doctorpricerWebApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the doctorpricerWebApp
 */
angular.module('doctorpricerWebApp')
  .controller('ResultCtrl', function ($scope, $stateParams, $timeout, $rootScope, $window, $state, leafletData, PracticesCollection, SearchModel) {
  	/* $scope variables */
  	$scope.sidebar = 1;
  	$scope.practices = PracticesCollection.displayCollection;
  	$scope.practiceCount = PracticesCollection.length;
  	$scope.userAddress = SearchModel.address;
  	$scope.radiuses = [
		{id: 2, name: '2km'},
		{id: 5, name: '5km'},
		{id: 10, name: '10km'},
		{id: 15, name: '15km'},
	];

    var setHeight = function() {
      $timeout(function() {
          var mapHeight = (PracticesCollection.screenHeight - 148) + 'px';
          document.getElementById('practice-list').style.height = mapHeight;
          document.getElementById('leaflet_map').style.height = mapHeight;
          document.getElementById('map_canvas').style.maxHeight = mapHeight;
      }, 250);
    };

	/* Listeners */
	// Sets the height of the map and list when window is resized
	var w = angular.element($window)
	w.bind('resize', function() {
		PracticesCollection.screenHeight = $window.innerHeight;
		setHeight();
	})

	$scope.$on('countUpdated', function() {
		$scope.practiceCount = PracticesCollection.length;
		if (PracticesCollection.displayCollection.length === 0) {
			$scope.noPractices = 1;
		} else {
			$scope.noPractices = 0;
		}
	});

	$scope.$on('newSearch', function() {
		PracticesCollection.selectedPractice = -1;
		$scope.thisPractice = {};
		PracticesCollection.changeRadius(2);
		SearchModel.initalizeModel(SearchModel.coords[0], SearchModel.coords[1], SearchModel.age, function() {
			$rootScope.$apply(function() {
				$rootScope.title = 'DoctorPricer - ' + SearchModel.displayAddress;
			});
			$scope.userAddress = SearchModel.address;
		}, function() {
			console.log('calculating address failed');
			// handle this error
		});
    });

    // Upon into the view we should do that
    setHeight();
    $rootScope.$broadcast('newSearch');

    /* Inverses the sidebar variable which determines whether the sidebar is active*/
    $scope.toggleSidebar = function() {
    	$scope.sidebar = !$scope.sidebar;
    }

	/* Calls the changeRadius method from the collection when user does that */
	$scope.changeRadius = function(distance) {
		PracticesCollection.changeRadius(distance);
		PracticesCollection.selectedPractice = -1;
		$scope.thisPractice = {};
	};

	/* Changes the selected practice and updates the map when user does that */
	$scope.navPractice = function(id, eventBroadcast) {
		PracticesCollection.selectedPractice = id;
		$scope.thisPractice = PracticesCollection.displayCollection[PracticesCollection.selectedPractice];
		if (eventBroadcast) {
			$rootScope.$broadcast('changePractice');
		}
	};

	/* Used to determine if an item is active */
	$scope.isActive = function(id) {
    	return id === PracticesCollection.selectedPractice;
    };
  });
