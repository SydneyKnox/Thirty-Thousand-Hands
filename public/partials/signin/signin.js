var signin = angular.module('tutorialWebApp.signin', []);

signin.controller('SignInCtrl', ['$scope','md5', '$firebaseAuth','$route','$location', '$rootScope', '$window', 
    function ($scope,md5, $firebaseAuth, $route, $location, $rootScope, $window) {
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
    
    $scope.goToProfile = function(){
        if(firebase.auth().currentUser != null){
            var email = firebase.auth().currentUser.email;
            console.log(email);
            
            var hash = md5.createHash(email);
            
            
            var NPref = firebase.database().ref('nonprofit/' + hash);
            NPref.once("value")
                .then(function(snapshot){
                    if(snapshot.exists()){
                        $scope.numNP = 0;
                        $scope.index = -1;
                        
                        var ref = firebase.database().ref('numNonprofits/');
                        ref.once("value").then(function(snapshot){
                            $scope.numNP = snapshot.val();
                           // console.log(snapshot.val());
                            for(var i=0;i<$scope.numNP;i++){
                                var newRef = firebase.database().ref('nonprofitEmails/' + i);
                                newRef.once("value").then(function(snapshot){
                                    
                                    if(snapshot.child('email').val() === email){
                                       // console.log(snapshot.child('email/').val());
                                       // console.log(email);
                                       $scope.index = i;
                                       $location.url('/profile/' + i);
                                       $route.reload();
                                    }
                                });
                            }
                        });
                        
                    }
                });
            
       
            var newRef = firebase.database().ref('Professors/' + hash);
            newRef.once("value")
                .then(function(snapshot){
                    if(snapshot.exists()){
                        //console.log("isNP");
                        $scope.numProfs = 0;
                        $scope.index = -1;
                        
                        var ref = firebase.database().ref('numProfs/');
                        ref.once("value").then(function(snapshot){
                            $scope.numProfs = snapshot.val();
                            
                            for(var i=0;i<$scope.numProfs;i++){
                                var newRef = firebase.database().ref('profEmails/' + i);
                                newRef.once("value").then(function(snapshot){
                                    if(snapshot.child('email').val() === email){
                                        $location.url('/profProfile/' + i);
                                        $route.reload();
                                    }
                                });
                            }
                        });
                    }
                });    
        }
    }
    
    $scope.signOut = function(){
        firebase.auth().signOut();
        console.log("Signout button clicked");
        $route.reload();
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
        $route.reload();
    };
}]);

