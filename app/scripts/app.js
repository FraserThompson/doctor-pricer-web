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
  .run(function($rootScope) {
    var needsClick = FastClick.prototype.needsClick;
    FastClick.prototype.needsClick = function(target) { 
      if ( (target.className || '').indexOf('pac-item') > -1 ) {
        return true;
      } else if ( (target.parentNode.className || '').indexOf('pac-item') > -1) {
        return true;
      } else {
        return needsClick.apply(this, arguments);
      }
    };

    FastClick.attach(document.body);
      $rootScope.title = "DoctorPricer";
    })
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        onEnter: function($rootScope) {
          $rootScope.hideFb = false;
          $rootScope.autocompleteSize = "big"; // dynamically load the css to size the Google Autocomplete box
        }
      })
      .state('result', {
        url: '/:lat,:lng/:age/',
        templateUrl: 'views/result.html',
        controller: 'ResultCtrl',
        resolve: {
          practices: function($state, $stateParams, PracticesCollection) {
            if (!isNaN(parseFloat($stateParams.lat)) && !isNaN(parseFloat($stateParams.lng)) && !isNaN(parseInt($stateParams.age))){
              return PracticesCollection.fetchData($stateParams.lat, $stateParams.lng, $stateParams.age);
            } else {
              return 0;
            }
          }
        },
        onEnter: function($window, $stateParams, $rootScope, SearchModel, PracticesCollection) {
          // Hide facebook like if we're on mobile
          if (window.innerWidth <= 481){
            $rootScope.hideFb = true;
          }
          SearchModel.coords = [parseFloat($stateParams.lat), parseFloat($stateParams.lng)];
          SearchModel.age = $stateParams.age;
          $rootScope.$broadcast('newSearch');
          $rootScope.autocompleteSize = "small"; // dynamically load the css to size the Google Autocomplete box
        }
      });
  });