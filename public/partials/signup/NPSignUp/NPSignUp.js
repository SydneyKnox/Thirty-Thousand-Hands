'use strict';

angular.module('tutorialWebApp.NPSignUp', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/NPSignUp', {
    templateUrl: 'partials/signup/NPSignUp/NPSignUp.html',
    controller: 'NPSignUpCtrl'
  });
}])


.controller('NPSignUpCtrl', ['$scope', '$firebaseAuth', '$location', '$rootScope', '$window', 
    function ($scope, $firebaseAuth, $location, $rootScope, $window) {
    console.log("NPSignUp Controller reporting for duty.");
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
       
    function registerUser(email, password, phoneNumber, skills, username){
        
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .catch(function(error){//this error checking should catch already exists type stuff
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log("Error: " + errorMessage);//TODO: add something here to do a fancy pop up if error is thrown
                return false;
            })
            .then(function(){
                console.log("successfully authorized user");
            
                firebase.auth().signInWithEmailAndPassword(email, password)
                .then(function(){
                         console.log("successfully signed in new user");
                         var numNP = firebase.database().ref('numNonprofits');
                         numNP.once("value")
                          .then(function(snapshot) {
                            var num = snapshot.val();
                            
                            
                            firebase.database().ref('nonprofit/' + num).set({
                                username: username,
                                email: email,
                                phone: phoneNumber,
                                skills: skills
                            }).catch(function(error){
                                 var errorcode = error.code;
                                 var errorMessage = error.message;
                                 console.log("Error: " + errorMessage);
                                 return false;
                            });
                            firebase.database().ref('numNonprofits').set(num + 1);
                            console.log("new num: " + (num + 1));
                         });
                         //numNP.once("value").then(function(snapshot){})
                         
                        
                })
                .catch(function(error){
                    console.log("Error: " + error.message);
                    return false;
                });
                return true;
            });
        return true;
    };
    
    $scope.checkStuff = function(){
        //console.log("checkStuff");
        angular.forEach($scope.checkModel.value, function (value, key) {
          if (value) {
          
            console.log(key);
         
          }
        });
    }
        
    $scope.signUp = function(){
        var txtEmail = $scope.user.email;
        var txtPassword = $scope.user.password;
        var username = $scope.user.username;
        var phoneNumber = $scope.phonenumber;
        var skills = [];
        
        angular.forEach($scope.checkModel.value, function (value, key) {
          if (value) {
          
            console.log(key);
            skills.push(key);
          }
        });
        
        console.log(skills);
        if(!$scope.regForm.$invalid){
            console.log("Valid form Submission");
      
            var registered = registerUser(txtEmail, txtPassword,phoneNumber, skills, username);

            if(registered){
                console.log("All successful");
                $location.url('/');
            }else{
                console.log("Database Failed");
            }
            
        }
        else{
            console.log("Invalid form submission");
        }
        
        $scope.user.username = '';
        $scope.user.email = '';
        $scope.user.password = '';
        $scope.phonenumber = '';
    };
}]);

