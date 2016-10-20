'use strict';

angular.module('tutorialWebApp.nonprofit', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/nonprofit/:nonprofit', {
    templateUrl: 'partials/nonprofit/nonprofit.html',
    controller: 'nonprofitCtrl'
  });
}])

// Wish List for each individual nonprofit page:
// Nonprofit name, address, email, and phone number
// Categorization of the Non-profits (animals, homelessness, food insecurity, etc)
// A needs list that is editable by the nonprofit (including more than just standard volunteer opportunities)
// 1 photo and accompanying short story/long form quote we pull from interview
// Links to the organization's’ personal websites for more information

// var ref = firebase.database().ref("users/ada");
// ref.once("value")
  // .then(function(snapshot) {
    // var key = snapshot.key; // "ada"
    // var childKey = snapshot.child("name/last"); // "last"
  // });
  // var spots = $firebaseObject(firebaseRef.child('0'));

  // spots.$loaded().then(function() {
    // $scope.spots = spots;
    // console.log($scope.spots);

.controller('nonprofitCtrl', ['$scope', '$firebaseAuth', '$location', '$rootScope', '$window', 
    function ($scope, $firebaseAuth, $location, $rootScope, $window){
        
        $scope.url = $location.url().split('/')[2];
        $scope.email = '';
        $scope.phoneNumber = '';
        $scope.skills = [];
        
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