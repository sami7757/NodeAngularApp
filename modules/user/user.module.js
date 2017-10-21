(function () {
	'use strict';
	
	angular.module('user', ['ngAnimate','ngSanitize','ui.bootstrap','angularUtils.directives.dirPagination'])
	.service('userdata', function($http, $q) {
		var users = null;
		var getUsersAsync = function() { 
		return	$http.get('http://localhost:3000/data/users.json').then(function(res) {
				users = res.data;
			});
		};
		var getUser = function(id) {
			return _.find(users,function(o) {
				return o.id == id;
			})
		};

		this.getUsers = function() {
			var def = $q.defer();

			if(users != null) 
				def.resolve(users);				
			else 
				getUsersAsync().then(function(){
					def.resolve(users);
				});

			return def.promise;
		};
		this.getUserWithId = function(id, callback) {
			var def = $q.defer();

			if(users != null)
				def.resolve(getUser(id));
			else
				getUsersAsync().then(function(){
					def.resolve(getUser(id));
				});

			return def.promise;
		};
	})
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
	.controller('ModalInstanceCtrl', function ($uibModalInstance, selectedUser) {
		var $ctrl = this;
		$ctrl.user = selectedUser;
	   
		$ctrl.cancel = function () {
		  $uibModalInstance.dismiss('cancel');
		};
	  })	  
	.controller('UserDetailsController',function($scope,$window,$http, $state, $stateParams, userdata) {
		userdata.getUserWithId($stateParams.id).then(function(user){ 
			$scope.user = user;
		});
	})
	.filter('ageFilter', function () {
		function calculateAge (birthday) { // birthday is a date
			var date = new Date(birthday);
			var ageDifMs = Date.now() - date.getTime();
			var ageDate = new Date(ageDifMs); // miliseconds from epoch
			return Math.abs(ageDate.getUTCFullYear() - 1970);
		}
	
		return function (birthdate) {
			return calculateAge(birthdate);
		};
	});	

	function JSONToCSVConvertor(JSONData, ReportTitle, ShowHeader) {     
		
		//If JSONData is not an object then JSON.parse will parse the JSON string in an Object
		var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
		var CSV = '';    
		//This condition will generate the Label/Header
		if (ShowHeader) {
			var header = "";
			var firstObj = JSONData[0];
			//This loop will extract the label from 1st index of on array
			for (var prop in firstObj) {
				//Now convert each value to string and comma-seprated
			   if(firstObj[prop])
				  header += prop + ',';
			}
			header = header.slice(0, -1);
			//append Label row with line break
			CSV += header + '\r\n';
		}
		
		//1st loop is to extract each row
		for (var i = 0; i < arrData.length; i++) {
			var row = "";
			//2nd loop will extract each column and convert it in string comma-seprated
			for (var index in arrData[i]) {
				row += '"' + arrData[i][index] + '",';
			}
			row.slice(0, row.length - 1);
			//add a line break after each row
			CSV += row + '\r\n';
		}
		
		if (CSV == '') {        
			alert("Invalid data");
			return;
		}   
		
		//this trick will generate a temp "a" tag
		var link = document.createElement("a");    
		link.id="lnkDwnldLnk";
		
		//this part will append the anchor tag and remove it after automatic click
		document.body.appendChild(link);
		
		var csv = CSV;  
		var blob = new Blob([csv], { type: 'text/csv' }); 
		var csvUrl = window.URL.createObjectURL(blob);
		var filename = 'SelectedUsers.csv';
		link.setAttribute("download", filename);
		link.setAttribute("href", csvUrl);
		link.click();
		//$('#lnkDwnldLnk')[0].click();    
		document.body.removeChild(link);
		}
}());
