'use strict';

angular.module('tutorialWebApp.nonprofit', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/nonprofit/:nonprofit', {
    templateUrl: 'partials/nonprofit/nonprofit.html',
    controller: 'nonprofitCtrl'
  });
}])

.controller('nonprofitCtrl', ['$scope','md5', '$firebaseAuth', '$location', '$rootScope', '$window',
    function ($scope,md5, $firebaseAuth, $location, $rootScope, $window){

        $scope.url = $location.url().split('/')[2];
        $scope.email = '';
        $scope.phoneNumber = '';
        $scope.skills = [];
        $scope.name = '';
        $scope.description = '';
        $scope.needs = '';
        $scope.image = '';
        $scope.isNonprofit = false;
        $scope.projects = {};
        $scope.projectNums = {};

        function getData(){
            var numRef = firebase.database().ref("nonprofitEmails/" + $scope.url);

            numRef.once("value")
              .then(function(snapshot){
                if(snapshot.exists()){
                    $scope.email = snapshot.child("email/").val();
                    console.log($scope.email);
                    //$scope.email = $scope.email.toLowerCase();
                    var hash = md5.createHash($scope.email);
                    var ref = firebase.database().ref('nonprofit/' + hash);
                    ref.once("value")
                      .then(function(snapshot){
                        $scope.phoneNumber = snapshot.child('phone/').val();
                        $scope.skills = snapshot.child('skills/').val();
                        $scope.name = snapshot.child('username/').val();
                        $scope.description = snapshot.child('about/').val();
                        $scope.needs = snapshot.child('needs/').val();
                        $scope.image = snapshot.child('picture/').val();
                        $scope.website = snapshot.child('website/').val();
                        $scope.narrative = snapshot.child('narrative/').val();
                        $scope.projectNums = snapshot.child('projects/').val();
                        console.log($scope.projectNums);
                        if($scope.website === null){
                          $scope.website = '';
                        }
                        console.log($scope.image);
                        $scope.$apply();

                        getProjects();
                      });

                    //$window.location.reload();
                } else{
                    console.log("snapshot does not exist");
                }
              });
        };

        function getProjects(){

            var projs = {};
            for(var key in $scope.projectNums){
              console.log(key);
              var projectRef = firebase.database().ref('projects/' + key);
              console.log(projectRef);

              projectRef.once("value").then(function(snapshot){
                console.log(snapshot.val());
                $scope.projects[snapshot.key] = snapshot.val();
                $scope.$apply();
                console.log($scope.projects);
              });
            }
        }

        getData();

    }]);
