'use strict';

angular.module('tutorialWebApp.editNeeds', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/editNeeds/:nonprofit', {
    templateUrl: 'partials/nonprofit/editNeeds.html',
    controller: 'needsCtrl'
  });
}])

.controller('needsCtrl', ['$scope','md5', '$firebaseAuth', '$location', '$rootScope', '$window', 
    function ($scope,md5, $firebaseAuth, $location, $rootScope, $window){
    $scope.isCollapsed = false;
    $scope.isCollapsedHorizontal = false;
    $scope.clicked = false;
    
    var People = ["Education", "Early Childhood Studies", "Psychology", "Social Work", "Sociology", "Anthropology", "Political Science", "Legal Services"]; 
    var Communicate = ["Mass Communications", "Journalism", "Grant and Technical Writing", "Public Relations", "Event Planning", "Languages and Interpretation"];
    var Arts = ["Creative Writing", "Visual Arts", "Design", "Performing Arts"];
    var Technology = ["Engineering", "Computer Science", "Analytics"]; 
    var Environment = ["Sustainability", "Natural Sciences", "Urban and Regional Planning", "Gardening"];
    var Business = ["Accounting", "Marketing", "Entrepreneurship", "Statistics", "Economy", "Fundraising and Philanthropy"];
    var Health = ["Nursing", "Pre-Med", "Public Health", "Global Health"];
    $scope.categories = {"People": People, "Communicate": Communicate, "Arts": Arts, "Technology": Technology, 
                         "Environment": Environment, "Business": Business, "Health": Health};

    
    $scope.checkModel = {
        
    };
    // $scope.phoneNumber = '';
    // $scope.skills = '';
    // $scope.name = '';
    // $scope.description = '';
    // $scope.needs = '';
    
    $scope.url = $location.url().split('/')[2];
    
    function getData(){
        var numRef = firebase.database().ref("nonprofitEmails/" + $scope.url);
                
        numRef.once("value")
          .then(function(snapshot){
            if(snapshot.exists()){
                $scope.email = snapshot.child("email/").val();
                console.log($scope.email);
                
                var hash = md5.createHash($scope.email);
                
                var ref = firebase.database().ref('nonprofit/' + hash);
                ref.once("value").then(function(snapshot){
                    $scope.phoneNumber = snapshot.child('phone/').val();
                    $scope.skills = snapshot.child('skills/').val();
                    $scope.name = snapshot.child('username/').val();
                    $scope.description = snapshot.child('about/').val();
                    $scope.needs = snapshot.child('needs/').val();
                    $scope.$apply();
                });

                
                //$window.location.reload();
            } else{
                console.log("snapshot does not exist");
            }
          });    
    }
    
    $scope.signUp = function(){
        
        var skills = [];
        var needs = $scope.needs;
        
        angular.forEach($scope.checkModel.value, function (value, key) {
          if (value) {
          
            console.log(key);
            skills.push(key);
          }
        });
        
        console.log(skills);
       
            //update params here
            var hash = md5.createHash($scope.email);
                
            firebase.database().ref('nonprofit/' + hash + '/skills/').set(skills);
            firebase.database().ref('nonprofit/' + hash + '/needs/').set(needs);
            
        $location.url('/');
    };

    
    // angular.forEach($scope.checkModel.value, function (value, key) {
          // if (value) {
            // console.log(key);
            // skills.push(key);
          // }
    getData();
    
        
    }]);