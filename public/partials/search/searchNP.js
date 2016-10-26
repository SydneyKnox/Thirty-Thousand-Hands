'use strict';

angular.module('tutorialWebApp.searchNP', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/search', {
    templateUrl: 'partials/search/searchNP.html',
    controller: 'searchCtrl'
  });
}])

.controller('searchCtrl', ['$scope','md5', '$firebaseAuth', '$location', '$rootScope', '$window', 
    function ($scope,md5, $firebaseAuth, $location, $rootScope, $window){
        
        var ref = firebase.database().ref('nonprofit/');
        
        ref.once("value").then(function(snapshot){
            $scope.list = snapshot.val();
            $scope.$apply();
        })
    }]);