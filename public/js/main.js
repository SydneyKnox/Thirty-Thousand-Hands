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
  'tutorialWebApp.about',
  'tutorialWebApp.us',
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

app.controller('homeCtrl',['$scope', 'md5','$firebaseAuth', '$location', '$rootScope', '$window',
    function ($scope, md5, $firebaseAuth, $location, $rootScope, $window){
    console.log("Home Controller Reporting for duty");

    //$scope.url = $location.url().split('/')[2];
    $scope.nonprofitNames = [];
    $scope.nonprofitNums = [];
    $scope.urls = {};
    $scope.myInterval = 5000;
    $scope.noWrapSlides = false;
    $scope.active = 0;
    var slides = $scope.slides = [];
    $scope.slideProjects = {};
    var currIndex = 0;
    //FirebaseError: Firebase Storage: Object 'nonprofitProfilePictures/0da9a514f0a2ec0973c8f757783a3c90/profile_picture.png' does not exist.
    //"https://s3.amazonaws.com/thirtythousandhandsimages/icons/Accounting.svg"
    function addSlide(project){
      var npHash = project.nonprofit;
    //  console.log(npHash);
      var ref = firebase.database().ref('nonprofit/' + npHash);
      //console.log(ref);
      ref.once("value")
        .then(function(snapshot){
          var url = snapshot.child('picture').val();
        //  console.log(snapshot.val());

          $scope.slides.push({
            image: url,
            id: currIndex++,
            name: project.name
          });
        });
        //console.log($scope.slides);
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
                    var num = $scope.nonprofitNums[i];
                    nameRef.once("value").then(function(snapshot){
                        //$scope.nonprofitNames.push(snapshot.val());
                        var email = snapshot.val();
                        var hash = md5.createHash(email);
                        var urlRef = firebase.database().ref('nonprofit/' + hash);
                        urlRef.once("value").then(function(snapshot){
                          var url = snapshot.child('picture').val();
                          console.log(num);
                          console.log(url);
                          $scope.urls[num] = url;
                        })
                        console.log(snapshot.val());
                    })
                }
                console.log($scope.nonprofitNames.length)
                console.log($scope.urls);
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
          //  console.log(project.val());
            addSlide(project.val());
          });
        //  console.log($scope.slideProjects);
      });
    }


    getData();
    getProjects();
    //console.log($scope.slides);

}]);
