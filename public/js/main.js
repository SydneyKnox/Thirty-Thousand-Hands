/**
 * Main AngularJS Web Application
 */
var app = angular.module('tutorialWebApp', [
  'ngRoute',
  'ui.bootstrap',
  'ui.mask',
  'angular-md5',
  'tutorialWebApp.signup',
  'tutorialWebApp.signin',
  'tutorialWebApp.NPSignUp',
  'tutorialWebApp.profSignUp',
  'tutorialWebApp.nonprofit',
  'tutorialWebApp.profile',
  'tutorialWebApp.editNeeds',
  'tutorialWebApp.profProfile',
  'tutorialWebApp.searchNP',
  'tutorialWebApp.searchProjects',
  'ng-htmlCompiler']
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
    $scope.nonprofitNums = [];

    $scope.myInterval = 5000;
    $scope.noWrapSlides = false;
    $scope.active = 0;
    var slides = $scope.slides = [];
    $scope.slideProjects = {};
    var currIndex = 0;

    $scope.addSlide = function(i) {//i is the key in firebase
      var newWidth = 600 + slides.length + 1;
      slides.push({
        image: '//unsplash.it/' + newWidth + '/300',
        id: currIndex++,
        name: $scope.slideProjects[i].name
      });
    };

    function getData(){
        var ref = firebase.database().ref("numNonprofits/");

        ref.once("value")
          .then(function(snapshot){
            if(snapshot.exists()){
                var i=0;
                for(i=0;i<4;i++){
                    var numOne = Math.random();
                    numOne = Math.floor(numOne*snapshot.val());
                    if(!$scope.nonprofitNums.includes(numOne)){
                        $scope.nonprofitNums.push(numOne);
                    }
                }
                console.log($scope.nonprofitNums);//I have an array of indices
                for(i=0;i<$scope.nonprofitNums.length;i++){
                    var nameRef = firebase.database().ref('nonprofitEmails/' + $scope.nonprofitNums[i] + '/email/');
                    nameRef.once("value").then(function(snapshot){
                        $scope.nonprofitNames.push(snapshot.val());
                        console.log(snapshot.val());
                    })
                }
                $scope.$apply();
            } else{
                console.log("snapshot does not exist");
            }
          })
    };

    function getProjects(){
      var ref = firebase.database().ref('projects/');

      ref.once("value")
        .then(function(snapshot){
          snapshot.forEach(function(project){
            $scope.slideProjects[project.key] = project.val();
            $scope.addSlide(project.key);
          });
          console.log($scope.slideProjects);
        });
    }


    getData();
    getProjects();
    console.log($scope.slides);

}]);
