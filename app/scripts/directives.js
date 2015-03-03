angular.module('doctorpricerWebApp')
	.directive('addressValidation', function() {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, element, attributes, controller) {
				controller.$validators.addressValidation = function(modelValue, viewValue) {
					if(controller.$isEmpty(modelValue)) {
						return false;
					}
					if(scope.details.autocomplete == scope.autocomplete && scope.details.geometry){
						return true;
					}
					return false;
				}

			}
		}
	})
	.directive('autoScroll', function(PracticesCollection) {
		return {
			restrict: 'A',
			link: function(scope, element, attributes, controller) {
				scope.$on('changePractice', function() {
					var el = angular.element(element[0]);
					el.duScrollTo(0, PracticesCollection.selectedPractice * 115, 250);
				});
			}
		}
	})
	