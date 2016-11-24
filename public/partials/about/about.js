'use strict';

angular.module('tutorialWebApp.about', ['ngRoute','firebase','ngSanitize'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/about', {
    templateUrl: 'partials/about/about.html',
    controller: 'aboutCtrl'
  });
}])



.controller('aboutCtrl', ['$scope','md5', '$firebaseAuth', '$location', '$rootScope', '$window',
    function ($scope,md5, $firebaseAuth, $location, $rootScope, $window){


}]);
