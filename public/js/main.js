/**
 * Main AngularJS Web Application
 */
var app = angular.module('tutorialWebApp', [
  'ngRoute',
  'ui.bootstrap',
  'ui.mask',
  'tutorialWebApp.signup',
  'tutorialWebApp.signin',
  'tutorialWebApp.NPSignUp',
  'tutorialWebApp.profSignUp',
  'tutorialWebApp.header',
  'tutorialWebApp.nonprofit']
);

/**
 * Configure the Routes
 */
app.config(['$routeProvider', function ($routeProvider, $locationProvider) {
  $routeProvider
    .when("/", 
        {   templateUrl: "partials/home/home.html", 
            controller: "homeCtrl"
        })
    // else 404
    .otherwise("/404", 
        {   templateUrl: "partials/404.html", 
            controller: "PageCtrl"
        });
}]);

app.controller('homeCtrl',['$scope', '$firebaseAuth', '$location', '$rootScope', '$window', 
    function ($scope, $firebaseAuth, $location, $rootScope, $window){
    console.log("Home Controller Reporting for duty");
    
    //$scope.url = $location.url().split('/')[2];
    $scope.nonprofitNames = [];
    
    function getData(){
        var ref = firebase.database().ref("nonprofit/");
        
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

    
    
    
   // getData();

    
}]);


