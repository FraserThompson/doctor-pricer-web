'use strict';

/**
 * @ngdoc function
 * @name doctorpricerWebApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the doctorpricerWebApp
 */
angular.module('doctorpricerWebApp')
  .controller('ResultCtrl', function ($scope, $stateParams, $timeout, $rootScope, $window, $state, ngDialog, leafletData, PracticesCollection, SearchModel) {
  	/* $scope variables */
  	$scope.sidebar = 1;
  	$scope.practices = PracticesCollection.displayCollection;
  	$scope.practiceCount = PracticesCollection.length;
  	$scope.christchurch = SearchModel.christchurch;
  	$scope.userAddress = SearchModel.address;
  	$scope.map = {'active': true};
  	$scope.radiuses = [
		{id: 2000, name: '2km'},
		{id: 5000, name: '5km'},
		{id: 10000, name: '10km'},
		{id: 15000, name: '15km'},
		{id: 30000, name: '30km'},
		{id: 60000, name: '60km'}
	];

	$scope.reportModal = function() {
		ngDialog.open({ template: 'views/report.html',
		controller: ['$scope', "$http",  function($scope, $http) {
				$scope.status = null;
				$scope.sending = false;
				$scope.submitForm = function(){
					$scope.sending = true;
					$scope.status = "Sending...";
					$http.get('https://api.doctorpricer.co.nz/contact', {
						'params': $scope.form
					})
					.success(function() {
						$scope.status = "Message sent.";
					})
					.error(function() {
						$scope.status = "Error sending message, try emailing doctorpricernz@gmail.com instead.";
					});
				}
	    	}]
		});
	}

	/* Inverses the sidebar variable which determines whether the sidebar is active*/
    $scope.toggleSidebar = function() {
    	$scope.sidebar = !$scope.sidebar;
    }

	/* Calls the changeRadius method from the collection when user does that */
	$scope.changeRadius = function(distance) {
		PracticesCollection.changeRadius(distance);
		$scope.thisPractice = {};
		$scope.map.active = true;
	};

	/* When leaving the reviews tab we need to recalculate all the maps things */
	$scope.reloadMap = function() {
		if (PracticesCollection.selectedPractice !== undefined){
			$rootScope.$broadcast('changePractice');
		}
	}

	/* Changes the selected practice and updates the map when user does that */
	$scope.navPractice = function(id, eventBroadcast) {
		PracticesCollection.selectedPractice = id;
		$scope.thisPractice = PracticesCollection.displayCollection[id];

		// Update the map stuff if it's active and we want to
		if ($scope.map.active && eventBroadcast) {
			$rootScope.$broadcast('changePractice');
		}

		if (!$scope.thisPractice.google) {
			PracticesCollection.getGoogle(id)
				.then(function(result) {
					 PracticesCollection.displayCollection[id]['google'] = result;
				})
		}
	};

	/* Used to determine if an item is active */
	$scope.isActive = function(id) {
    	return id === PracticesCollection.selectedPractice;
    };

    var setHeight = function() {
		$timeout(function() {
          var mapHeight = ($window.innerHeight - 148) + 'px';
          document.getElementById('practice-list').style.maxHeight = mapHeight;
      	}, 300);
    };

	/* Listeners */
	// Sets the height of the list when window is resized
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
		$scope.map.active = true;
		$scope.selectedItem = $scope.radiuses[0];
		SearchModel.initalizeModel(SearchModel.coords[0], SearchModel.coords[1], SearchModel.age, function() {
			$rootScope.$apply(function() {
				$rootScope.title = 'DoctorPricer - ' + SearchModel.displayAddress;
			});
			$scope.christchurch = SearchModel.christchurch;
			$scope.userAddress = SearchModel.address;
			$scope.changeRadius(2000);
			setHeight();
		}, function() {
			console.log('calculating address failed');
			// handle this error
		});
    });

    // Upon into the view we should do that
    setHeight();
    $rootScope.$broadcast('newSearch');
  });
