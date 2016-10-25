'use strict';

angular.module('tutorialWebApp.editNeeds', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/editNeeds/:nonprofit', {
    templateUrl: 'partials/nonprofit/editNeeds.html',
    controller: 'needsCtrl'
  });
}])

.controller('needsCtrl', ['$scope','md5', '$firebaseAuth', '$location', '$rootScope', '$window', 
    function ($scope,md5, $firebaseAuth, $location, $rootScope, $window){
        
        
    }]);