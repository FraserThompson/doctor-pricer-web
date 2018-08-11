'use strict';

require('angular');
require('angular-simple-logger'),
require('ui-leaflet')

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
    require('angular-ui-bootstrap/src/collapse'),
    require('angular-ui-bootstrap/src/rating'),
    require('angular-ui-bootstrap/src/tabs'),
    require('angular-ui-bootstrap/src/modal'),
    require('./scripts-thirdparty/ngAutocomplete.js'),
    require('angular-animate'),
    require('angular-resource'),
    require('angular-route'),
    require('angular-touch'),
    require('angular-scroll')
  ])
  .run(['$rootScope', '$uibModal', function($rootScope, $uibModal) {
      $rootScope.title = "Doctor price comparison NZ | Find the cheapest doctor | DoctorPricer";
      $rootScope.apiUrl = "https://api.doctorpricer.co.nz";
      /* Opens the modal */
      $rootScope.openDialog = function() {
        $uibModal.open({ templateUrl: 'views/info.html'}).result.then(function () {}, function () {});
      };
    }])
  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        onEnter: ['$rootScope', function($rootScope) {
          $rootScope.hideFb = false;
          $rootScope.autocompleteSize = "big-autocomplete"; // dynamically load the css to size the Google Autocomplete box
        }]
      })
      .state('result', {
        url: '/:lat,:lng/:age/',
        templateUrl: 'views/result.html',
        controller: 'ResultCtrl',
        resolve: {
          error: ['$state', '$stateParams', function($state, $stateParams) {
            if (!isNaN(parseFloat($stateParams.lat)) && !isNaN(parseFloat($stateParams.lng)) && !isNaN(parseInt($stateParams.age))){
              return 0;
            } else {
              return 1;
            }
          }]
        },
        onEnter: ['$stateParams', '$rootScope', 'SearchModel', function($stateParams, $rootScope, SearchModel) {
          // Hide facebook like if we're on mobile
          if (window.innerWidth <= 481) $rootScope.hideFb = true;
          SearchModel.coords = [parseFloat($stateParams.lat), parseFloat($stateParams.lng)];
          SearchModel.age = $stateParams.age;
          $rootScope.$broadcast('newSearch');
          $rootScope.autocompleteSize = "small-autocomplete"; // dynamically load the css to size the Google Autocomplete box
        }]
      });
  }]);