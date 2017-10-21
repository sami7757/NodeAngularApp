(function () {
	'use strict';
	
	angular.module('user', ['ngAnimate','ngSanitize','ui.bootstrap','angularUtils.directives.dirPagination'])	
	.controller('ModalInstanceCtrl', function ($uibModalInstance, selectedUser) {
		var $ctrl = this;
		$ctrl.user = selectedUser;
	   
		$ctrl.cancel = function () {
		  $uibModalInstance.dismiss('cancel');
		};
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
}());
