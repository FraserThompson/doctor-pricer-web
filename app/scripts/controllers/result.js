'use strict';

/**
 * @ngdoc function
 * @name doctorpricerWebApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the doctorpricerWebApp
 */
angular.module('doctorpricerWebApp')
  .controller('ResultCtrl', ['$scope', '$timeout', '$rootScope', '$window', '$state', '$uibModal', 'error', 'PracticesCollection', 'SearchModel', function ($scope, $timeout, $rootScope, $window, $state, $uibModal, error, PracticesCollection, SearchModel) {

    if (error === 1) $state.go('home');

    /* $scope variables */
    $scope.sidebar = 1;
    $scope.reviewCount = 0;
    $scope.christchurch = SearchModel.christchurch;
    $scope.userAddress = SearchModel.address;
    $scope.map = {'active': true};
    $scope.radiuses = [];
    $scope.practices = [];
    $scope.loading = true;

    /* Pops up the modal for reporting badthings */
    $scope.reportModal = function() {
        $uibModal.open({ templateUrl: 'views/report.html',
            size: "sm"
        }).result.then(function () {}, function () {});
    }

    /* Inverses the sidebar variable which determines whether the sidebar is active*/
    $scope.toggleSidebar = function() {
        $scope.sidebar = !$scope.sidebar;
    };

    /* Cancels the swipe gesture so that moving the map doesn't swipe the page */
    $scope.cancelSwipe = function($event){
        $event.stopPropagation();
    }

    /* Changes the radius when user does that */
    $scope.changeRadius = function(index) {
        PracticesCollection.displayCollection = $scope.radiuses[index]["practices"];

        // sort that shit by price
        PracticesCollection.displayCollection.sort(function(a, b){
            var keyA = a.price,
                keyB = b.price;

            if(keyA < keyB) return -1;
            if(keyA > keyB) return 1;

            return 0;
        });

        $scope.practices = PracticesCollection.displayCollection;
        $scope.thisPractice = {};
        $scope.map.active = true;
        $rootScope.$broadcast('countUpdated');
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
        $scope.thisPractice = $scope.practices[id];

        // Update the map stuff if it's active and we want to
        if ($scope.map.active && eventBroadcast) {
            $rootScope.$broadcast('changePractice');
        }

        //Get reviews from Google if not there
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
          var mapHeight = ($window.innerHeight - 128) + 'px';
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

    $rootScope.$on('geolocatedAddress', function() {

        $rootScope.$apply(function() {
            $rootScope.title = 'DoctorPricer - ' + SearchModel.displayAddress;
        });

        $scope.christchurch = SearchModel.christchurch;
        $scope.userAddress = SearchModel.address;
    });

    // Fired whenever the radius is changed to update the displayed count
    $scope.$on('countUpdated', function() {
        $scope.noPractices = PracticesCollection.displayCollection.length === 0 ? 1 : 0;
    });

    // Fired whenever a new search is started
    $scope.$on('newSearch', function() {

        $scope.map.active = true;
        $scope.loading = true;

        var get_practices = PracticesCollection.fetchData(SearchModel.coords[0], SearchModel.coords[1], SearchModel.age);

        get_practices.then(function(data) {
            $scope.practices = data;

            // Add the radius options
            $scope.radiuses = 
            [	
                {
                    "key": 0,
                    "name": "2km", 
                    "distance": 2000, 
                    "practices": []
                },
                {	
                    "key": 1,
                    "name": "5km", 
                    "distance": 5000, 
                    "practices":[]
                }, 
                {
                    "key": 2,
                    "name": "10km", 
                    "distance": 10000, 
                    "practices": []
                }, 
                {	
                    "key": 3,
                    "name": "30km", 
                    "distance": 30000, 
                    "practices": []
                }, 
                {	
                    "key": 4,
                    "name": "60km", 
                    "distance": 60000, 
                    "practices": []
                }
            ];

            // sort into radius buckets (not super happy about any of this fyi)
            for (var i = 0; i < $scope.radiuses.length; i++){

                var curr_radius_distance = $scope.radiuses[i].distance;

                // All arrays include previous arrays
                if (i != 0) $scope.radiuses[i]["practices"].push.apply($scope.radiuses[i]["practices"], $scope.radiuses[i - 1]["practices"]);

                for (var j = 0; j < PracticesCollection.collection.length; j++){
                    
                    var practice_distance = PracticesCollection.collection[j].distance;

                    // If we're getting too far then go to next radius
                    if (practice_distance > curr_radius_distance) break;

                    // Put the practice in it's radius bucket and remove it from the main collection so it's faster
                    $scope.radiuses[i]["practices"].push(PracticesCollection.collection[j]);
                    PracticesCollection.collection.splice(j, 1);
                    j = j - 1;

                }
            }

            console.log("Sorted the result into buckets.");

            // a second for loop to remove empty ones and duplicates (this sucks)
            for (var i = $scope.radiuses.length - 1; i >= 0; i--){
                if ($scope.radiuses[i].practices.length === 0 || (i > 0 && $scope.radiuses[i].practices.length === $scope.radiuses[i - 1].practices.length)) $scope.radiuses.splice(i, 1);
            }

            console.log("Removed empties and duplicates.");

            $scope.selectedRadius = $scope.radiuses[0];
            $scope.changeRadius(0);

            setHeight();
            $scope.loading = false;

            console.log("Finished.");

        }, function(response) {
            console.log('Error getting the data:' + response);
            $state.go('home');
        });

    });

    // Upon into the view we should do that
    $rootScope.$broadcast('newSearch');

  }]);