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
    'leaflet-directive',
    'ui.bootstrap.showErrors',
    'ngDialog',
    'duScroll',
    'ui.router'
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
        url: '/:lat,:lng/:age/:rad/:selected/',
        params: {'lat': undefined, 'lng': undefined, 'age': undefined, 'rad': undefined, 'selected': undefined},
        templateUrl: 'views/result.html',
        controller: 'ResultCtrl',
        resolve: {
          practices: function(PracticesCollection) {
            return PracticesCollection.fetchData(function(){});
          }
        },
        onEnter: function($stateParams, SearchModel) {
          SearchModel.coords = [$stateParams.lat, $stateParams.lng];
          SearchModel.age = $stateParams.age;
        }
      })
  });
