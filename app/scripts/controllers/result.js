'use strict';

require('hammerjs');

/**
 * @ngdoc function
 * @name doctorpricerWebApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the doctorpricerWebApp
 */
angular.module('doctorpricerWebApp')
  .controller('ResultCtrl', ['$scope', '$timeout', '$rootScope', '$window', '$state', '$transitions', '$stateParams', '$uibModal', 'error', 'sortedPractices', 'PracticesCollection', 'SearchModel', function ($scope, $timeout, $rootScope, $window, $state, $transitions, $stateParams, $uibModal, error, sortedPractices, PracticesCollection, SearchModel) {

    if (error === 1) $state.go('home');

    /* $scope variables */
    $scope.userAddress = SearchModel.address;
    $scope.csc = SearchModel.csc;
    $scope.christchurch =  SearchModel.christchurch;
    $scope.practices = PracticesCollection.displayCollection;
    $scope.noPractices = function () { return PracticesCollection.displayCollection.length === 0 ? 1 : 0; };
    $scope.radiuses = sortedPractices;

    $scope.selectedRadius = $scope.radiuses[0];
    $scope.filtered = false;
    $scope.thisPractice = {};

    $scope.reviewCount = 0;
    $scope.map = {'active': true};
    $scope.loading = false;

    /* All this stuff should really be in a directive but yeah whatever, it handles the swipeable sidebar */
    var sidebarElement = document.getElementById('sidebar');
    var overlayElement = document.getElementById('overlay');
    var listElement = document.getElementById('practice-list');
    var offcanvas_position = ($window.innerWidth * 0.90);
    var closeThreshold = -(offcanvas_position * 0.20);
    var openThreshold = -(offcanvas_position * 0.80);

    $scope.sidebarState = $stateParams['#'];

    $scope.closeSidebarAction = function() {
        if ($window.innerWidth <= 767) {
            sidebarElement.style.transform = "translateX(" + -(offcanvas_position) + "px)";
            overlayElement.style.zIndex = "-1";
            overlayElement.style.opacity = 0;
        }
    }

    $scope.openSidebarAction = function() {
        if ($window.innerWidth <= 767) {
            sidebarElement.style.transform = "translateX(" + 0 + "px)";
            overlayElement.style.zIndex  = "7";
            overlayElement.style.opacity = 0.4;
        }
    }

    $scope.closeSidebar = function() {
        $state.go('result', {'#': 'map'}, {'inherit': true, 'notify': false});
    }

    $scope.openSidebar = function() {
        $state.go('result', {'#': 'list'}, {'inherit': true, 'notify': false});
    }

    $scope.toggleSidebar = function() {
        if ($scope.sidebarState == "map") {
            $scope.openSidebar();
        } else {
            $scope.closeSidebar();
        }
    }

    var clamp = function(number, min, max) {
        if (number >= max) return max;
        if (number <= min) return min;
        return number;
    }

    // We need to listen for swipes on the inner and outer element for some reason idk
    var elementsWhichNeedHammers = [sidebarElement, listElement];
    for (var i = 0; i < elementsWhichNeedHammers.length; i++) {

        var mcSidebar = new Hammer(elementsWhichNeedHammers[i]);

        mcSidebar.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL });

        // listen to events...
        mcSidebar.on("panleft panright", function(ev) {

            if (ev.center.x === 0 && ev.center.y === 0) return

            var sidebarLeft = sidebarElement.offsetLeft + ev.deltaX;
            var sidebarLocationNew = clamp(sidebarLeft, -(offcanvas_position), 0);

            sidebarElement.style.transform = "translateX(" + sidebarLocationNew + "px)";
            overlayElement.style.opacity = 0.4 *  (1 - (sidebarLocationNew / -(offcanvas_position)));
            overlayElement.style.display = "initial";

        });

        mcSidebar.on("panend pancancel", function(ev) {

            var sidebarLocation = sidebarElement.getBoundingClientRect();
            if ($scope.sidebarState == "list") {
                if (sidebarLocation.left <= closeThreshold) {
                    $scope.closeSidebar();
                } else {
                    $scope.openSidebarAction();
                }
            } else {
                if (sidebarLocation.left >= openThreshold) {
                    $scope.openSidebar();
                } else {
                    $scope.closeSidebarAction();
                }
            }

        });

    }

    overlayElement.addEventListener("touchstart", function() {
        $scope.closeSidebar();
    });

    /* End of sidebar mobile stuff */

    // Handle the back button (doesn't seem to trigger $stateparams change)
    $transitions.onSuccess({}, function(transition) {
        var params = transition.params();
        $scope.sidebarState = params['#'];
        $scope.sidebarState == "map" ? $scope.closeSidebarAction() : $scope.openSidebarAction();
    });

    $scope.$watch('$viewContentLoaded', function(){
        $rootScope.resultsLoading = false;
    });

    /* Pops up the modal for reporting badthings */
    $scope.reportModal = function() {
        $uibModal.open({ templateUrl: 'views/report.html',
            size: "sm"
        }).result.then(function () {}, function () {});
    }

    /* Cancels the swipe gesture so that moving the map doesn't swipe the page */
    $scope.cancelSwipe = function($event){
        $event.stopPropagation();
    }

    /* Changes the radius when user does that */
    $scope.changeFilter = function() {
        PracticesCollection.changeRadius($scope.selectedRadius, $scope.filtered);
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

        $scope.closeSidebar();

        // Update the map stuff if it's active and we want to
        if ($scope.map.active && eventBroadcast) $rootScope.$broadcast('changePractice');

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
          var mapPxHeight = $window.innerHeight - 115;
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
        sidebarElement.style.transform = "translateX(" + 0 + "px)";
    });

    // Fired whenever the radius is changed to update the displayed count
    $scope.$on('countUpdated', function() {
        $scope.noPractices();
    });

    setHeight();
    $scope.sidebarState == "map" ? $scope.closeSidebarAction() : $scope.openSidebarAction();

  }]);
