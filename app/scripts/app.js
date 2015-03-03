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
  .run(function($route, $rootScope, $location) {
    // Someone else wrote this stuff
    var original = $location.path;
    $location.path = function (path, reload) {
        if (reload === false) {
            var lastRoute = $route.current;
            var un = $rootScope.$on('$locationChangeSuccess', function () {
                $route.current = lastRoute;
                un();
            });
        }
        return original.apply($location, [path]);
    };
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        title: 'Doctor Pricer',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/result/:lat,:lng/:age', {
        templateUrl: 'views/result.html',
        controller: 'ResultCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
