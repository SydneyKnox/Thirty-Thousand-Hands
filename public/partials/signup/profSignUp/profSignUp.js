'use strict';

angular.module('tutorialWebApp.profSignUp', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/profSignUp', {
    templateUrl: 'partials/signup/profSignUp/profSignUp.html',
    controller: 'profSignUpCtrl'
  });
}])

.controller('profSignUpCtrl', ['$scope', '$firebaseAuth', function ($scope, $firebaseAuth) {
    console.log("profSignUp Controller reporting for duty.");
    
    $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 
                    'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 
                    'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 
                    'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 
                    'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 
                    'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 
                    'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 
                    'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 
                    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
                    
    function registerUser(email, password){
           
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
                .catch(function(error){
                    console.log("Error: " + error.message);
                    return false;
                });
                return true;
            });
    };    
    
    function addUserToDataBase(username, txtEmail, txtPassword, dprtmnt, phoneNumber){
         firebase.database().ref('Professors/' + username).set({
            email: txtEmail,
            password: txtPassword,
            department: dprtmnt,
            phone: phoneNumber
         }).catch(function(error){
             var errorcode = error.code;
             var errorMessage = error.message;
             console.log("Error: " + errorMessage);
             return false;
         });
         return true;
    };
    
    $scope.signUp = function(){
        var txtEmail = $scope.user.email;
        var txtPassword = $scope.user.password;
        var username = $scope.user.username;
        var dprtmnt = $scope.selected;
        var phoneNumber = $scope.phonenumber;
        
        if(!$scope.regForm.$invalid){
            console.log("Valid form Submission");
            var registered = registerUser(txtEmail, txtPassword);
            var databased = addUserToDataBase(username, txtEmail, txtPassword,dprtmnt, phoneNumber);
            
            if(databased){
                console.log("All successful");
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
        $scope.selected = '';
        $scope.phonenumber = '';
    };
}]);

