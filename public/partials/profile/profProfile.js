'use strict';

angular.module('tutorialWebApp.profProfile', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/profProfile/:profProfile', {
    templateUrl: 'partials/profile/profProfile.html',
    controller: 'profProfileCtrl'
  });
}])

.controller('profProfileCtrl', ['$scope','md5', '$firebaseAuth', '$location', '$rootScope', '$window', 
    function ($scope,md5, $firebaseAuth, $location, $rootScope, $window){
    
    var email = '';
    $scope.email = '';
    $scope.phone = '';
    $scope.username = '';
    $scope.about = '';
    $scope.skills = [];
    $scope.url = $location.url().split('/')[2];
    
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
                    console.log($scope.phone);
                    $scope.username = snapshot.child('username/').val();
                    console.log($scope.username);
                    $scope.about = snapshot.child('about/').val();
                    console.log(snapshot.child('about/').val());
                    $scope.skills = snapshot.child('skills/').val();
                    console.log(snapshot.child('skills/').val());
                    //console.log(snapshot.val());
                    $scope.$apply();
                }
            });
        
            var ref = firebase.database().ref('Professors/' + hash +'/email');
            ref.once("value")
                .then(function(snapshot){
                    console.log(snapshot.val());
                    if(snapshot.val() != null){
                    var newRef = firebase.database().ref('Professors/' + hash);
                    newRef.once("value")
                        .then(function(snapshot){
                            $scope.email = email;
                            $scope.phone = snapshot.child('phone/').val();
                            $scope.username = snapshot.child('username/').val();
                            $scope.about = snapshot.child('about/').val();
                            $scope.skills = snapshot.child('skills/').val();
                            $scope.$apply();
                        });
                    }
                });
        
        
    } else{
        //$scope.userSignedIn = true;
    }
    }]);
    
    
  //make separate list of nums and emails