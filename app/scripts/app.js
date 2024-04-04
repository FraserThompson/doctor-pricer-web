'use strict';

require('angular');
require('angular-simple-logger');
require('ui-leaflet');
require('angular-bootstrap-show-errors');

// uiRouter needs a special require
var uiRouter = require('@uirouter/angularjs').default;

// Polyfill for state events which were deprecated
require('@uirouter/angularjs/release/stateEvents.js');

/**
 * @ngdoc overview
 * @name doctorpricerWebApp
 * @description
 * # doctorpricerWebApp
 *
 * Main module of the application.
 */
angular
  .module('doctorpricerWebApp', [
    'ui.router.state.events',
    uiRouter,
    'nemLogging',
    'ui-leaflet',
    'ui.bootstrap.showErrors',
    require('angular-ui-bootstrap/src/collapse'),
    require('angular-ui-bootstrap/src/rating'),
    require('angular-ui-bootstrap/src/tabs'),
    require('angular-ui-bootstrap/src/modal'),
    require('./scripts-thirdparty/ngAutocomplete.js'),
    require('angular-animate'),
    require('angular-resource'),
    require('angular-route'),
    require('angular-scroll')
  ])
  .run(['$rootScope', '$uibModal', function($rootScope, $uibModal) {
      $rootScope.title = "Doctor price comparison NZ | Find the cheapest doctor | DoctorPricer";
      $rootScope.metadescription = "Compare GP fees from 1000+ practices across New Zealand with this free easy-to-use tool. Compare doctors near you and find the cheapest price. Don't pay more than you need to for a doctors visit! Find a GP which meets your budget."
      $rootScope.apiUrl = "https://api.doctorpricer.co.nz";
      /* Opens the modal */
      $rootScope.openDialog = function() {
        $uibModal.open({ templateUrl: 'views/info.html'}).result.then(function () {}, function () {});
      };
      $rootScope.openChchDialog = function() {
        $uibModal.open({ templateUrl: 'views/info-chch.html'}).result.then(function () {}, function () {});
      };
    }])
  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        onEnter: ['$rootScope', function($rootScope) {
          $rootScope.hideFb = false;
          $rootScope.title = "Doctor price comparison NZ | Find the cheapest doctor | DoctorPricer";
          $rootScope.app_loaded = true;
          $rootScope.autocompleteSize = "big-autocomplete"; // dynamically load the css to size the Google Autocomplete box
        }]
      })
      .state('result', {
        url: '/:lat,:lng/:age,:csc',
        templateUrl: 'views/result.html',
        controller: 'ResultCtrl',
        reloadOnSearch: false,
        params: {
          address: null,
          display_address: null
        },
        resolve: {
          error: ['$stateParams', '$q', '$rootScope', function($stateParams, $q, $rootScope) {

            console.log("[RESOLVE] Checking for errors in URL...");

            $rootScope.app_loaded = true;
            $rootScope.resultsLoading = true;

            var defer = $q.defer();

            if (!isNaN(parseFloat($stateParams.lat)) && !isNaN(parseFloat($stateParams.lng)) && !isNaN(parseInt($stateParams.age))){
              defer.resolve();
            } else {
              defer.reject('URL params are somehow not right');
            }

            return defer.promise;

          }],
          initializeSearchModel: ['SearchModel', '$stateParams',  function(SearchModel, $stateParams,) {

            console.log("[RESOLVE] Initializing search model...");

            return SearchModel.initalizeModel(
              $stateParams.lat,
              $stateParams.lng,
              $stateParams.age,
              $stateParams.csc,
              $stateParams.address,
              $stateParams.display_address
            );

          }],
          sortedPractices: ['$stateParams', 'PracticesCollection', function($stateParams, PracticesCollection) {
              console.log("[RESOLVE] Fetching practices...");
              return PracticesCollection.fetchData($stateParams.lat, $stateParams.lng, $stateParams.age, $stateParams.csc);
          }]
        },
        onEnter: ['$rootScope', '$timeout', '$window', 'SearchModel', function($rootScope, $timeout, $window, SearchModel) {

          // Hide facebook like if we're on mobile
          if (window.innerWidth <= 481) $rootScope.hideFb = true;

          $rootScope.autocompleteSize = "small-autocomplete"; // dynamically load the css to size the Google Autocomplete box
          $rootScope.title = 'DoctorPricer - ' + SearchModel.displayAddress;

        }]
      })
      .state('fees-report', {
        url: '/fees-report',
        templateUrl: 'views/fees-report.html',
        onEnter: ['$rootScope', function($rootScope) {
          $rootScope.hideFb = false;
          $rootScope.title = "2024 GP Fees Report | DoctorPricer";
          $rootScope.metadescription = "In the last two years the cost of seeing a GP has increased significantly.";
        }]
      });
  }]);
