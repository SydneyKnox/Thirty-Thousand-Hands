'use strict';

angular.module('tutorialWebApp.profile', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/profile', {
    templateUrl: 'partials/profile/profile.html',
    controller: 'profileCtrl'
  });
}])

.controller('profileCtrl', ['$scope', '$firebaseAuth', '$location', '$rootScope', '$window', 
    function ($scope, $firebaseAuth, $location, $rootScope, $window){
        
        if(firebase.auth().currentUser == null){
            $location.url('/');
        } else{
            //check if user is NP
            //check if user is Prof
            //check if user is us????
            var email == firebase.auth().currentUser.email;
            console.log(email);
            
            
        }
        
    }]);