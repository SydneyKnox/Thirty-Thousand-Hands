var signin = angular.module('tutorialWebApp.signin', []);

signin.controller('SignInCtrl', ['$scope', '$firebaseAuth', function ($scope, $firebaseAuth) {
    console.log("SignIn Controller reporting for duty.");
 
    if(firebase.auth().currentUser == null){
        $scope.userSignedIn = false;
    } else{
        $scope.userSignedIn = true;
    }
    
    firebase.auth().onAuthStateChanged(function(user){
        if(firebase.auth().currentUser){
            $scope.userSignedIn = true;
            console.log("user signed in: " + firebase.auth().currentUser);
            console.log($scope.userSignedIn);
            $scope.$apply();
        } else{
            $scope.userSignedIn = false;
            console.log(firebase.auth().currentUser);
            $scope.$apply();
        }
    });
    
    $scope.signOut = function(){
        firebase.auth().signOut();
        console.log("Signout button clicked");
       // $scope.$apply();
    };
    
    $scope.signIn = function(){
       console.log("login button clicked");
       
       $scope.user.invalidEmail = false;
       $scope.user.userDoesNotExist = false;
       $scope.user.incorrectPassword = false;
       
        if (firebase.auth().currentUser) {
            console.log(firebase.auth().currentUser.email);
            firebase.auth().signOut();
            console.log(firebase.auth().currentUser.email);
            console.log("have to sign out first.");
        } else{
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
        }
        //$scope.$apply();
    };
}]);

