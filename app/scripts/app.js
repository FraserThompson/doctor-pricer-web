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
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .state('result', {
        url: '/:lat,:lng/:age/',
        templateUrl: 'views/result.html',
        controller: 'ResultCtrl',
        resolve: {
          practices: function(PracticesCollection) {
            return PracticesCollection.fetchData();
          }
        },
        onEnter: function($stateParams, SearchModel) {
          SearchModel.coords = [$stateParams.lat, $stateParams.lng];
          SearchModel.age = $stateParams.age;
        }
      });
  });
