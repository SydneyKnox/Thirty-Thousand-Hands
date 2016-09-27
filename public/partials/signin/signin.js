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
    
    $scope.signIn = function(){
       console.log("login button clicked");
       
       $scope.user.invalidEmail = false;
       $scope.user.userDoesNotExist = false;
       $scope.user.incorrectPassword = false;
       
        if (firebase.auth().currentUser) {
            firebase.auth().signOut();
            console.log("have to sign out first?");
        }
        
        var email = $scope.user.email;
        var password = $scope.user.password;
       
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error){
           console.log(error.code);
           var errorCode = error.code;
           
           if(errorCode === 'auth/invalid-email'){
                $scope.user.invalidEmail = true;
           }
           if(errorCode === 'auth/user-not-found' || errorCode === 'auth/user-disabled'){
               $scope.user.userDoesNotExist = true;
           }
           if(errorCode === 'auth/wrong-password'){
               $scope.user.incorrectPassword = true;
           }else{
               console.log("random error?");
           }
           
            
        });
       
        //console.log(firebase.auth().currentUser.email);
        if(!$scope.regForm.$invalid){
            $scope.user.email= '';
            $scope.user.password = '';
            $('#myModal').modal('hide');  
        }else{
            $scope.user.email= '';
            $scope.user.password = '';
        }

    };
}]);

