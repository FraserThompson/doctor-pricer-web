'use strict';

/**
 * @ngdoc function
 * @name doctorpricerWebApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the doctorpricerWebApp
 */
angular.module('doctorpricerWebApp')
  .controller('ResultCtrl', ['$scope', '$timeout', '$rootScope', '$window', '$state', '$stateParams', '$uibModal', 'error', 'sortedPractices', 'PracticesCollection', 'SearchModel', function ($scope, $timeout, $rootScope, $window, $state, $stateParams, $uibModal, error, sortedPractices, PracticesCollection, SearchModel) {

    if (error === 1) $state.go('home');

    /* $scope variables */
    $scope.userAddress = SearchModel.address;
    $scope.christchurch =  SearchModel.christchurch;
    $scope.practices = PracticesCollection.displayCollection;
    $scope.noPractices = function () { return PracticesCollection.displayCollection.length === 0 ? 1 : 0; };
    $scope.radiuses = sortedPractices;

    $scope.selectedRadius = $scope.radiuses[0];
    $scope.thisPractice = {};

    $scope.sidebar = $stateParams.menu == "map" ? 0 : 1;
    $scope.reviewCount = 0;
    $scope.map = {'active': true};
    $scope.loading = false;

    $scope.$watch('$viewContentLoaded', function(){
        $rootScope.results_loading = false;
    });

    /* Pops up the modal for reporting badthings */
    $scope.reportModal = function() {
        $uibModal.open({ templateUrl: 'views/report.html',
            size: "sm"
        }).result.then(function () {}, function () {});
    }

    /* Inverses the sidebar variable which determines whether the sidebar is active*/
    $scope.toggleSidebar = function() {
        $scope.sidebar = !$scope.sidebar;
        $state.go('result', {'#': $scope.sidebar == 0 ? 'map' : 'list'}, {'location': 'replace', 'inherit': true, 'notify': false});
    };

    /* Cancels the swipe gesture so that moving the map doesn't swipe the page */
    $scope.cancelSwipe = function($event){
        $event.stopPropagation();
    }

    /* Changes the radius when user does that */
    $scope.changeRadius = function(selected) {
        PracticesCollection.changeRadius(selected);

        $scope.practices = PracticesCollection.displayCollection;
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
          var mapPxHeight = $window.innerHeight - 128;
          if ($scope.christchurch) mapPxHeight = mapPxHeight - 98;
          var mapHeight = mapPxHeight + 'px';
          var listHeight = (mapPxHeight + 2) + 'px';
          document.getElementById('practice-list').style.maxHeight = listHeight;
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
        $scope.noPractices();
    });

    setHeight();
    
  }]);