'use strict';

angular.module('tutorialWebApp.NPSignUp', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/NPSignUp', {
    templateUrl: 'partials/signup/NPSignUp/NPSignUp.html',
    controller: 'NPSignUpCtrl'
  });
}])

.controller('NPSignUpCtrl', ['$scope', '$firebaseAuth', function ($scope, $firebaseAuth) {
    console.log("NPSignUp Controller reporting for duty.");
    
}]);

