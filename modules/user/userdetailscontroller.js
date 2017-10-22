angular.module('user')	  
.controller('UserDetailsController',['$scope','$stateParams','userdata', function($scope, $stateParams, userdata) {
    userdata.getUserWithId($stateParams.id).then(function(user){ 
        $scope.user = user;
        $scope.viewModel = { firstName:user.firstName, lastName: user.lastName };
        $scope.save = function() {
            $scope.user.firstName = $scope.viewModel.firstName;
            $scope.user.lastName = $scope.viewModel.lastName;
        };
    });
}]);