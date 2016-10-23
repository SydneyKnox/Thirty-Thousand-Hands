'use strict';

angular.module('tutorialWebApp.nonprofit', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/nonprofit/:nonprofit', {
    templateUrl: 'partials/nonprofit/nonprofit.html',
    controller: 'nonprofitCtrl'
  });
}])

.controller('nonprofitCtrl', ['$scope', '$firebaseAuth', '$location', '$rootScope', '$window', 
    function ($scope, $firebaseAuth, $location, $rootScope, $window){
        
        $scope.url = $location.url().split('/')[2];
        $scope.email = '';
        $scope.phoneNumber = '';
        $scope.skills = [];
        $scope.name = '';
        $scope.description = '';
        
        function getData(){
            var ref = firebase.database().ref("nonprofit/" + $scope.url);
            
            ref.once("value")
              .then(function(snapshot){
                if(snapshot.exists()){
                    $scope.email = snapshot.child("email/").val();
                    console.log($scope.email);
                    $scope.phoneNumber = snapshot.child("phone/").val();
                    $scope.skills = snapshot.child("skills/").val();
                    console.log($scope.skills);
                    $scope.name = snapshot.child("username/").val();
                    $scope.description = snapshot.child("about/").val();
                    $scope.$apply();
                    //$window.location.reload();
                } else{
                    console.log("snapshot does not exist");
                }
              })
              .then(function(){
                //checkPhase();
              });
        };
        
        function checkPhase(){
            if ($scope.$$phase != '$apply' && $scope.$$phase != '$digest' &&(!$scope.$root || ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest'))) {
                //$scope.$apply();
                $window.location.reload();
            }            
        }

        
        
        
        getData();
        
    }]);