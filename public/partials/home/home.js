'use strict';

angular.module('tutorialWebApp.home', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'partials/home/home.html',
    controller: 'homeCtrl'
  });
}]);

.controller('homeCtrl', ['$scope', '$firebaseAuth', '$location', '$rootScope', '$window', 
    function ($scope, $firebaseAuth, $location, $rootScope, $window){
        
   
   
});