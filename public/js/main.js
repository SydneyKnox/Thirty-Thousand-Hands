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
        var ref = firebase.database().ref("numNonprofits/");
        
        ref.once("value")
          .then(function(snapshot){
            if(snapshot.exists()){
                var i=0;
                for(i=0;i<4;i++){
                    var numOne = Math.random();
                    numOne = Math.floor(numOne*snapshot.val());
                    if(!$scope.nonprofitNames.includes(numOne)){
                        $scope.nonprofitNames.push(numOne);
                    }
                }
                console.log($scope.nonprofitNames);
                $scope.$apply();
            } else{
                console.log("snapshot does not exist");
            }
          })
          .then(function(){
            //checkPhase();
          });
    };
    
    
    getData();

    
}]);


