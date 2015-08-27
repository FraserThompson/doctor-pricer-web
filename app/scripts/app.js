'use strict';

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
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ngTouch',
    'ngAutocomplete',
    'ngDialog',
    'leaflet-directive',
    'duScroll',
    'ui.router',
    'ui.bootstrap.showErrors',
    'ui.bootstrap'
  ])
  .run(function() {
    FastClick.attach(document.body);
  })
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        onEnter: function($rootScope) {
          $rootScope.autocompleteSize = "big"; // dynamically load the css to size the Google Autocomplete box
        }
      })
      .state('result', {
        url: '/:lat,:lng/:age/',
        templateUrl: 'views/result.html',
        controller: 'ResultCtrl',
        resolve: {
          practices: function($stateParams, PracticesCollection) {
            return PracticesCollection.fetchData($stateParams.lat, $stateParams.lng, $stateParams.age);
          }
        },
        onEnter: function($stateParams, $rootScope, SearchModel, PracticesCollection) {
          SearchModel.coords = [parseFloat($stateParams.lat), parseFloat($stateParams.lng)];
          SearchModel.age = $stateParams.age;
          $rootScope.$broadcast('newSearch');
          $rootScope.autocompleteSize = "small"; // dynamically load the css to size the Google Autocomplete box
        }
      });
  });
