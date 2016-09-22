var signin = angular.module('tutorialWebApp.signin', []);

signin.controller('SignInCtrl', ['$scope', '$firebaseAuth', function ($scope, $firebaseAuth) {
    console.log("SignIn Controller reporting for duty.");
    var config = {
            apiKey: "AIzaSyDYyKejWwPDBG3WuU32DA7Fyj71qWVJMbA",
            authDomain: "nonprofit-91165.firebaseapp.com",
            databaseURL: "https://nonprofit-91165.firebaseio.com",
            storageBucket: "nonprofit-91165.appspot.com",
            messagingSenderId: "869188628673"
    };
    firebase.initializeApp(config);    

    function checkIfUserExists(username) {
        var ref = firebase.database().ref("users/" + username);
        ref.once("value")
            .then(function(snapshot){
                var childEmail = snapshot.child("email").val();
                
                if(childEmail != null){
                    return true;
                } else{
                    return false;
                }
        });
    };
    
    $scope.signIn = function(){
       console.log("login button clicked");
       
       var username = $scope.user.username;
       var password = $scope.user.password;
       console.log(username);
       var exists = checkIfUserExists(username);
       console.log(exists);
       console.log("Valid Form Submission");
       
       var ref = firebase.database().ref("users/" + username);
       ref.once("value")
        .then(function(snapshot){
            var childEmail = snapshot.child("email").val();
            console.log(childEmail);
            if(childEmail != null){
                console.log("User exists");
                firebase.auth().signInWithEmailAndPassword(childEmail, password).catch(function(error){
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log("Error: " + errorMessage);
                });
            } else{
                console.log("User does not exist");
            }
        });
       
       $scope.username= '';
       $scope.password = '';
    };
}]);

