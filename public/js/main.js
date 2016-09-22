/**
 * Main AngularJS Web Application
 */
var app = angular.module('tutorialWebApp', [
  'ngRoute',
  'tutorialWebApp.signup',
  'tutorialWebApp.signin']
);

/**
 * Configure the Routes
 */
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when("/", 
        {   templateUrl: "partials/home/home.html", 
            controller: "PageCtrl"
        })
    // else 404
    .otherwise("/404", 
        {   templateUrl: "partials/404.html", 
            controller: "PageCtrl"
        });
}]);

app.controller('PageCtrl', function(){
    console.log("Page Controller Reporting for duty");
})


