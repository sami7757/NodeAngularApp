(function () {
	'use strict';

	angular.module('app', [
		'ui.router',

		'user',		
		'common',
		
		'ui.bootstrap'
	])
	.config(['$urlRouterProvider','$stateProvider', function($urlRouterProvider, $stateProvider) {
		$urlRouterProvider.otherwise('/');

		$stateProvider.state('home', {
			url: '/',
			templateUrl: 'modules/common/home.html'
		}).state('users', {
			url: '/users',
			templateUrl: 'modules/user/users.htm',
			controller: 'UserController'
		})
		.state('userdetail', {
			url: '/user/:id',
			templateUrl: 'modules/user/userdetail.htm',
			controller: 'UserDetailsController'
		})
	}]);
}());