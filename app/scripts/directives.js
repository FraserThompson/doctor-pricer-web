'use strict';

/**
 * @ngdoc function
 * @name doctorpricerWebApp.directives:Directives
 * @description
 * # Directives
 * There's only two so they're in one file. One is for address validation, the other for autoscrolling.
 */

angular.module('doctorpricerWebApp')
	.directive('addressValidation', function() {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, element, attributes, controller) {
				controller.$validators.addressValidation = function(modelValue) {
					if(controller.$isEmpty(modelValue)) {
						return false;
					}
					if(scope.details.autocomplete === scope.autocomplete && scope.details.geometry){
						return true;
					}
					return false;
				};
			}
		};
	})
	.directive('autoScroll', function(PracticesCollection) {
		return {
			restrict: 'A',
			link: function(scope, element) {
				scope.$on('updateScroll', function() {
					var el = angular.element(element[0]);
					var practice = angular.element(document.getElementById('practice_' + PracticesCollection.selectedPractice));
					el.duScrollTo(practice, 0, 250);
				});
			}
		};
	})
	.directive('loadingButton', function($timeout) {
		return {
			replace: 'true',
			require: '^form',
			template: '<span><span ng-hide="!isLoading"><i class="fa fa-spinner fa-spin fa-lg"></i></span><button ng-hide="isLoading" type="submit" class="btn btn-cool {{btnSize}}"><span class="glyphicon glyphicon-search" aria-hidden="true"></span> Search</button></span>',
			link: function(scope, elem, attributes, form) {
				scope.btnSize = attributes.btnSize;

				scope.$on('newSearch', function() {
          			scope.isLoading = false;
				});

				elem.bind('click', function() {
				    if(!form.$invalid) {
				       scope.isLoading = true;
				    } else {
				    	scope.isLoading = false;
				    }
				});
			}
		}
	});