'use strict';

angular.module('tutorialWebApp.profSignUp', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/profSignUp', {
    templateUrl: 'partials/signup/profSignUp/profSignUp.html',
    controller: 'profSignUpCtrl'
  });
}])

.controller('profSignUpCtrl', ['$scope', '$firebaseAuth', function ($scope, $firebaseAuth) {
    console.log("profSignUp Controller reporting for duty.");
   
}]);

