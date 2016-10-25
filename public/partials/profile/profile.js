'use strict';

angular.module('tutorialWebApp.profile', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/profile', {
    templateUrl: 'partials/profile/profile.html',
    controller: 'profileCtrl'
  });
}])

.controller('profileCtrl', ['$scope','md5', '$firebaseAuth', '$location', '$rootScope', '$window', 
    function ($scope,md5, $firebaseAuth, $location, $rootScope, $window){
    
    var email = '';
    $scope.email = '';
    $scope.phone = '';
    $scope.username = '';
    $scope.about = '';
    $scope.skills = [];
    
    if(firebase.auth().currentUser != null){
        email = firebase.auth().currentUser.email;
        console.log(email);
        
        var hash = md5.createHash(email);
        
        
        var NPref = firebase.database().ref('nonprofit/' + hash);
        NPref.once("value")
            .then(function(snapshot){
                if(snapshot != null){
                    $scope.email = email;
                    $scope.phone = snapshot.child('phone/').val();
                    console.log(snapshot.child('phone/').val());
                    $scope.username = snapshot.child('username/').val();
                    console.log(snapshot.child('username/').val());
                    $scope.about = snapshot.child('about/').val();
                    console.log(snapshot.child('about/').val());
                    $scope.skills = snapshot.child('skills/').val();
                    console.log(snapshot.child('skills/').val());
                    //console.log(snapshot.val());
                    $scope.$apply();
                }
            });
        var ref = firebase.database().ref('Professors/' + hash);
        ref.once("value")
            .then(function(snapshot){
                if(snapshot != null){//this is obviously still not null...should be
                    $scope.email = email;
                    $scope.phone = snapshot.child('phone/').val();
                    $scope.username = snapshot.child('username/').val();
                    $scope.about = snapshot.child('about/').val();
                    $scope.skills = snapshot.child('skills/').val();
                    console.log(snapshot.val());
                    $scope.$apply();
                }
            });
        
    } else{
        //$scope.userSignedIn = true;
    }
    }]);
    
    
  //make separate list of nums and emails