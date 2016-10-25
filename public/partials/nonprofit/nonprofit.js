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
        
        $scope.isNonprofit = false;
        
        function getData(){
            var numRef = firebase.database().ref("nonprofitEmails/" + $scope.url);
            
            numRef.once("value")
              .then(function(snapshot){
                if(snapshot.exists()){
                    $scope.email = snapshot.child("email/").val();
                    console.log($scope.email);
                    
                    var hash = md5.createHash($scope.email);
                    
                    var ref = firebase.database().ref('nonprofit/' + hash);
                    ref.once("value").then(function(snapshot){
                        $scope.phoneNumber = snapshot.child('phone/').val();
                        $scope.skills = snapshot.child('skills/').val();
                        $scope.name = snapshot.child('username/').val();
                        $scope.description = snapshot.child('about/').val();
                        $scope.needs = snapshot.child('needs/').val();
                        $scope.$apply();
                        
                        isUserNonprofit();
                    });
                    
                    //$window.location.reload();
                } else{
                    console.log("snapshot does not exist");
                }
              });
        };
        
        function isUserNonprofit(){
            var currUser = firebase.auth().currentUser;
            console.log(currUser);
            if(currUser != null){
                var currEmail = currUser.email;
                //user is signed in
                if(currEmail.toLowerCase() === $scope.email.toLowerCase()){
                    console.log(currEmail.toLowerCase());
                    console.log($scope.email.toLowerCase());
                    $scope.isNonprofit = true;
                    console.log($scope.isNonprofit);
                    $scope.$apply();
                }
            }
        }
       
        getData();
        //isUserNonprofit();
    }]);