'use strict';

angular.module('tutorialWebApp.us', ['ngRoute','firebase','ngSanitize'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/us/:name', {
    templateUrl: 'partials/us/us.html',
    controller: 'usCtrl'
  });
}])



.controller('usCtrl', ['$scope','md5', '$firebaseAuth', '$location', '$rootScope', '$window',
    function ($scope,md5, $firebaseAuth, $location, $rootScope, $window){

    $scope.url = $location.url().split('/')[2];
    $scope.image= "https://s3.amazonaws.com/thirtythousandhandsimages/us/"+ $scope.url + ".jpg";

    $scope.Major = '';
    $scope.name = '';

    $scope.questions = {

    }
    function getData(){

      var ref = firebase.database().ref('us/' + $scope.url);
      ref.once("value").then(function(snapshot){
        console.log(snapshot.val());

        $scope.Major = snapshot.child('Major').val();
        $scope.name = snapshot.child('name').val();
        $scope.questions['What is the experience that most transformed you?'] = snapshot.child('experience').val();
        $scope.questions['What do you hope to do after graduation?'] = snapshot.child('graduation').val();
        $scope.questions['Where do you find inspiration?'] = snapshot.child('inspiration').val();
        $scope.questions['What is your greatest strength?'] = snapshot.child('strength').val();
        $scope.questions['What is one thing you know for sure?'] = snapshot.child('youKnow').val();

        $scope.$apply();
      });
    }

    getData();
}]);
