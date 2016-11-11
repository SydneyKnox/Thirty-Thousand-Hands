'use strict';

angular.module('tutorialWebApp.profile', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/profile/:profile', {
    templateUrl: 'partials/profile/profile.html',
    controller: 'profileCtrl'
  });
}])

.controller('profileCtrl', ['$scope','md5', '$firebaseAuth', '$location', '$rootScope', '$window', 
    function ($scope,md5, $firebaseAuth, $location, $rootScope, $window){
    
    var email = '';
    $scope.email = '';
    $scope.phone = '';
    $scope.username = '';
    $scope.about = '';
    $scope.skills = [];
    $scope.url = $location.url().split('/')[2];
    $scope.oneAtATime = true;
    var People = ["Education", "Early Childhood Studies", "Psychology", "Social Work", "Sociology", "Anthropology", "Political Science", "Legal Services"]; 
    var Communicate = ["Mass Communications", "Journalism", "Grant and Technical Writing", "Public Relations", "Event Planning", "Languages and Interpretation"];
    var Arts = ["Creative Writing", "Visual Arts", "Design", "Performing Arts"];
    var Technology = ["Engineering", "Computer Science", "Analytics"]; 
    var Environment = ["Sustainability", "Natural Sciences", "Urban and Regional Planning", "Gardening"];
    var Business = ["Accounting", "Marketing", "Entrepreneurship", "Statistics", "Economy", "Fundraising and Philanthropy"];
    var Health = ["Nursing", "Pre-Med", "Public Health", "Global Health"];
    $scope.categories = {"People": People, "Communicate": Communicate, "Arts": Arts, "Technology": Technology, 
                         "Environment": Environment, "Business": Business, "Health": Health};
                             
      $scope.status = {
        isCustomHeaderOpen: false,
        isFirstOpen: true,
        isFirstDisabled: false
      };
    
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