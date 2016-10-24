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
    
    if(firebase.auth().currentUser != null){
        email = firebase.auth().currentUser.email;
        console.log(email);
        
        var hash = md5.createHash(email);
        
        var ref = firebase.database().ref('nonprofit/' + hash);
        ref.once("value")
            .then(function(snapshot){
                console.log(snapshot.val());
            });
        
    } else{
        //$scope.userSignedIn = true;
    }
    }]);
    
    
  //make separate list of nums and emails