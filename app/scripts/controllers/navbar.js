angular.module('doctorpricerWebApp')
  .controller('NavbarCtrl', function ($scope, $rootScope, $location, $timeout, ngDialog, SearchModel) {
  	$scope.navbarThings = 0;
  	$scope.age = SearchModel.age;
  	$scope.autocomplete = SearchModel.displayAddress;
  	$scope.options = {
  		country: 'nz'
  	};
    $scope.details = {};
    $scope.details.geometry = {}
    $scope.details.geometry.location = {}

	$rootScope.$on("$locationChangeStart", function(event, next, current) {
		//This could be better
		if (next.indexOf('result') > -1) {
			$scope.navbarThings = 1;
		} else {
			$scope.navbarThings = 0;
		}
	});

    /* Associate the details found with the text submitted so input validation is easier */
    $scope.$watch('details', function() {
      $timeout(function() {
        $scope.details.autocomplete = $scope.autocomplete
      }, 200);
    })
  	
  	/* When there's a new search update the values in the search box */
  	$scope.$on('newSearch', function() {
  		$scope.age = SearchModel.age;
  		$scope.autocomplete = SearchModel.displayAddress;
  		$scope.details.geometry.location.k = SearchModel.coords[0];
  		$scope.details.geometry.location.D = SearchModel.coords[1];
  		$scope.details.autocomplete = $scope.autocomplete
  		$scope.navbarThings = 1;
  	});

  	$scope.openDialog = function() {
      ngDialog.open({ template: 'views/info.html'});
    }


  	/* Used for the navbar search submit button */
  	$scope.next = function() {
      $scope.$broadcast('show-errors-check-validity');
      if ($scope.headerForm.$invalid) { return; }
      $location.path('result/' + $scope.details.geometry.location.k + ',' + $scope.details.geometry.location.D + '/' + $scope.age);
    }

  });