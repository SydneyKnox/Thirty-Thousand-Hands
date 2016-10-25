'use strict';

angular.module('tutorialWebApp.profSignUp', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/profSignUp', {
    templateUrl: 'partials/signup/profSignUp/profSignUp.html',
    controller: 'profSignUpCtrl'
  });
}])

.controller('profSignUpCtrl', ['$scope', 'md5','$firebaseAuth', '$location', '$rootScope', '$window', 
    function ($scope,md5, $firebaseAuth, $location, $rootScope, $window) {
    console.log("profSignUp Controller reporting for duty.");
    
    $scope.isCollapsed = false;
    $scope.isCollapsedHorizontal = false;
    $scope.clicked = false;
    
    
    $scope.checkModel = {
        
    };
    
    var People = ["Education", "Early Childhood Studies", "Psychology", "Social Work", "Sociology", "Anthropology", "Political Science", "Legal Services"]; 
    var Communicate = ["Mass Communications", "Journalism", "Grant and Technical Writing", "Public Relations", "Event Planning", "Languages and Interpretation"];
    var Arts = ["Creative Writing", "Visual Arts", "Design", "Performing Arts"];
    var Technology = ["Engineerng", "Computer Science", "Analytics"]; 
    var Environment = ["Sustainability", "Natural Sciences", "Urban and Regional Planning", "Gardening"];
    var Business = ["Accounting", "Marketing", "Entrepreneurship", "Statistics", "Economy", "Fundraising and Philanthropy"];
    var Health = ["Nursing", "Pre-Med", "Public Health", "Global Health"];
    $scope.categories = {"People": People, "Communicate": Communicate, "Arts": Arts, "Technology": Technology, 
                         "Environment": Environment, "Business": Business, "Health": Health};

    
    $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 
                    'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 
                    'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 
                    'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 
                    'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 
                    'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 
                    'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 
                    'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 
                    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
                    
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
                    
                        var numProfs = firebase.database().ref('numProfs');
                            numProfs.once("value")
                              .then(function(snapshot){
                                 var num = snapshot.val();
                                 
                                firebase.database().ref('profEmails/' + num).set({
                                    email: email
                                })
                                var hash = md5.createHash(email);
                                 firebase.database().ref('Professors/' + hash).set({
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
                                 firebase.database().ref('numProfs').set(num + 1);
                                 console.log("new num: " + (num + 1));
                            })
                         
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
        //var dprtmnt = $scope.selected;
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
            var registered = registerUser(txtEmail, txtPassword, phoneNumber, skills, username);
            
            if(registered){
                console.log("All successful");
                $location.url('/')
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
       // $scope.selected = '';
        $scope.phonenumber = '';
    };
}]);

