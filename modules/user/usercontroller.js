angular.module('user')
.controller('UserController',function($scope,$window,$uibModal,$log, userdata) {
    $scope.users = {};
    $scope.isAllSelected = false;
    $scope.selectedUsers = [];
    userdata.getUsers().then(function(data) {
        $scope.users = _.map(data, function(user) {
            return { id: user.id, firstName: user.firstName, lastName: user.lastName, dob: user.dateOfBirth, isSelected: false }
        });
    });	
    $scope.removeUser = function(id) {
        _.remove($scope.selectedUsers, function(userId) { 
            return userId == id 
        });
        _.remove($scope.users, function(user) { 
            return user.id == id 
        });
    };
    $scope.toggleUser = function(user) {
        if(user.isSelected) 
            $scope.selectedUsers.push(user.id);
        else
            _.remove($scope.selectedUsers, function(id) { 
                return id == user.id 
            });
    };
    $scope.removeSelectedUsers = function() {
        $scope.users = $scope.users.filter(function(user) {
            return !user.isSelected;
        })
        
        $scope.selectedUsers = [];
    };
    $scope.selectAllRows = function() {
        $scope.selectedUsers = [];
        _.map($scope.users, function(user) {
            if($scope.isAllSelected) 
                $scope.selectedUsers.push(user);
            user.isSelected = $scope.isAllSelected;
        });
    };
    $scope.downloadUsers = function() {
        userdata.getUsers().then(function(data) {
            if($scope.isAllSelected)
                var users = data;
            else 
                users = data.filter(function(user) {
                    return $scope.selectedUsers.indexOf(user.id) >= 0;
                });
            JSONToCSVConvertor(users, "The Selected Users", true);
        });
    };
    $scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }
    $scope.open = function (id) {
        var modalInstance = $uibModal.open({
          animation: true,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'modalContent.htm',
          controller: 'ModalInstanceCtrl',
          controllerAs: '$ctrl',
          resolve: {
            selectedUser: function () {
              return _.find($scope.users,function(o) {
                    return o.id == id;
                });
            }
          }
        });
    
        modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });	  
    };
})