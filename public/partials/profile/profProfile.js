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
    $scope.interests = [];
    $scope.hash = '';
    $scope.projects = {};
    $scope.projectNums = {};

//TODO add profile Picture getting (STORED BY EMAIL HASH)
//TODO add notifications getting...will be stored under 'notifications/'
//TODO get my projects

    $scope.submitPic = function(){
      var hash = md5.createHash($scope.email);
      console.log(hash);
      var ProfRef = firebase.database().ref('Professors/' + hash);
      var updates = {};
      var filename = document.getElementById('file');
      console.log(filename);
      console.log(filename.files[0].name);
      //https://s3.amazonaws.com/thirtythousandhandsimages/profilePictures/1493d0f6731e9073840b47f9d586f7b8/december.jpg
      updates['Professors/'+ hash +'/picture'] = 'https://s3.amazonaws.com/thirtythousandhandsimages/profilePictures/' + hash + '/' + filename.files[0].name;
      firebase.database().ref().update(updates);
    }

    function getProjects(){

        var projs = {};
        for(var key in $scope.interests){
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


    if(firebase.auth().currentUser != null){
        email = firebase.auth().currentUser.email;
        console.log(email);

        var hash = md5.createHash(email);
        $scope.hash=hash;

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
                        $scope.interests = snapshot.child('interests/').val();

                        $scope.image = snapshot.child('picture/').val();
                        $scope.notifications = snapshot.child('notifications/').val();
                        $scope.$apply();

                        getProjects();
                    });
                }
            });


    } else{
        //$scope.userSignedIn = true;
    }
    }]);


  //make separate list of nums and emails
