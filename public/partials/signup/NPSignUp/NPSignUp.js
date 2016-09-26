'use strict';

angular.module('tutorialWebApp.NPSignUp', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/NPSignUp', {
    templateUrl: 'partials/signup/NPSignUp/NPSignUp.html',
    controller: 'NPSignUpCtrl'
  });
}])

.controller('NPSignUpCtrl', ['$scope', '$firebaseAuth', function ($scope, $firebaseAuth) {
    console.log("NPSignUp Controller reporting for duty.");
    
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
        
    function addUserToDataBase(username, email, password, phoneNumber){
         firebase.database().ref('nonprofit/' + username).set({
            email: email,
            password: password,
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
        var phoneNumber = $scope.phonenumber;
        
        if(!$scope.regForm.$invalid){
            console.log("Valid form Submission");
            
            var registered = registerUser(txtEmail, txtPassword);
            var databased = addUserToDataBase(username, txtEmail, txtPassword, phoneNumber);
            
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
        $scope.phonenumber = '';
    };
}]);

