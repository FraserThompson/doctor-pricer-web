'use strict';

/**
 * @ngdoc function
 * @name doctorpricerWebApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the doctorpricerWebApp
 */
angular.module('doctorpricerWebApp')
  .controller('ResultCtrl', function ($scope, $timeout, $rootScope, $window, $state, practices, ngDialog, leafletData, PracticesCollection, SearchModel) {
  	if (practices === 0){$state.go('home');}
  	/* $scope variables */
  	$scope.sidebar = 1;
  	$scope.reviewCount = 0;
  	$scope.practices = PracticesCollection.displayCollection;
  	$scope.practiceCount = PracticesCollection.length;
  	$scope.christchurch = SearchModel.christchurch;
  	$scope.userAddress = SearchModel.address;
  	$scope.map = {'active': true};
  	$scope.radiuses = [];

	/* Pops up the modal for reporting badthings */
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
    };

	/* Calls the changeRadius method from the collection when user does that */
	$scope.changeRadius = function(index) {
		PracticesCollection.changeRadius(index);
		$scope.thisPractice = {};
		$scope.map.active = true;
	};

	/* When leaving the reviews tab we need to recalculate all the maps things */
	$scope.reloadMap = function() {
		if (PracticesCollection.selectedPractice !== undefined){
			$rootScope.$broadcast('changePractice');
		}
	};

	/* Changes the selected practice and updates the map when user does that */
	$scope.navPractice = function(id, eventBroadcast) {
		PracticesCollection.selectedPractice = id;
		$scope.thisPractice = PracticesCollection.displayCollection[id];

		// Update the map stuff if it's active and we want to
		if ($scope.map.active && eventBroadcast) {
			$rootScope.$broadcast('changePractice');
		}

		// Get reviews from Google if not there
		if (!$scope.thisPractice.google) {
			PracticesCollection.getGoogle(id)
				.then(function(result) {
					PracticesCollection.displayCollection[id]['google'] = result;
					PracticesCollection.displayCollection[id]['reviewCount'] = "(" + (result.reviews ? result.reviews.length : 0).toString() + ")";
				});
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
          document.getElementById('reviews').style.maxHeight = mapHeight;
      	}, 300);
    };

	/* Listeners */
	// Sets the height of the list when window is resized
	var w = angular.element($window)
	w.bind('resize', function() {
		PracticesCollection.screenHeight = $window.innerHeight;
		setHeight();
	});

	// Fired whenever the radius is changed to update the displayed count
	$scope.$on('countUpdated', function() {
		$scope.practiceCount = PracticesCollection.length;
		$scope.noPractices = PracticesCollection.displayCollection.length === 0 ? 1 : 0;
	});

	// Fired whenever a new search is made
	$scope.$on('newSearch', function() {
		$scope.map.active = true;

		// Add the radius options from what the server returned
		$scope.radiuses = [];
		for (var i = 0; i < PracticesCollection.collection.length; i++){
  			$scope.radiuses.push({id: i, name: PracticesCollection.collection[i].value/1000 + 'km'})
  		}

		$scope.selectedItem = $scope.radiuses[0];
		SearchModel.initalizeModel(SearchModel.coords[0], SearchModel.coords[1], SearchModel.age, function() {
			$scope.changeRadius(0);
			$rootScope.$apply(function() {
				$rootScope.title = 'DoctorPricer - ' + SearchModel.displayAddress;
			});
			$scope.christchurch = SearchModel.christchurch;
			$scope.userAddress = SearchModel.address;
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