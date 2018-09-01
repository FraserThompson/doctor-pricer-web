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
	.directive('autoScroll', ['PracticesCollection', function(PracticesCollection) {
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
	}])
	.directive('loadingButton', ['$timeout', function($timeout) {
		return {
			replace: 'true',
			require: '^form',
			template: '<span><span ng-hide="!isLoading"><i class="fa fa-spinner fa-spin fa-lg" style="font-size: 24px;"></i></span><button ng-hide="isLoading" type="submit" class="btn btn-cool {{btnSize}}"><span class="glyphicon glyphicon-search" aria-hidden="true"></span> Search</button></span>',
			link: function(scope, elem, attributes, form) {
				scope.btnSize = attributes.btnSize;

				scope.$on('countUpdated', function() {
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
	}])
	.directive('stupidAd', ['$timeout', function($timeout) {
		return {
			replace: 'true',
			template: '<div class="stupid-ad"> \
						<ins class="adsbygoogle" \
						style="display:block" \
						data-ad-client="ca-pub-2527917281752489" \
						data-ad-slot="1395256542" \
						data-ad-format="auto" \
						</ins> \
						</div>',
			link: function() {
				$timeout(function() {
					try {
						(window["adsbygoogle"] = window["adsbygoogle"] || []).push({});
					} catch (e) {
						console.error(e);
					}
				}, 1000);
			}
		}
	}])
	.directive('disableTap', ['$timeout', function($timeout) {
		return {
			link: function() {
				$timeout(function() {
					var container = document.getElementsByClassName('pac-container');
					// disable ionic data tap
					angular.element(container).attr('data-tap-disabled', 'true');
				},500);
			}
		};
	}]);