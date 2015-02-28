angular.module('doctorpricerWebApp')
	.directive('addressValidation', function() {
		return {
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