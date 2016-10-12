'use strict';

var header = angular.module('tutorialWebApp.header', []);

header.controller('HeaderCtrl', ['$scope', '$firebaseAuth', function ($scope, $firebaseAuth) {
    console.log("Header Controller reporting for duty.");
    if(firebase.auth().currentUser == null){
        $scope.userSignedIn = false;
    } else{
        $scope.userSignedIn = true;
    }
    
    firebase.auth().onAuthStateChanged(function(user){
        if(firebase.auth().currentUser){
            $scope.userSignedIn = true;
            console.log("user signed in: " + firebase.auth().currentUser);
        } else{
            $scope.userSignedIn = false;
            console.log(firebase.auth().currentUser);
        }
    });
    
    $scope.signOut = function(){
        firebase.auth().signOut();
        console.log("Signout button clicked");
    };
}]);

