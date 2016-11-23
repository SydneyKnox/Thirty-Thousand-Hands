'use strict';

angular.module('tutorialWebApp.NPSignUp', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/NPSignUp', {
    templateUrl: 'partials/signup/NPSignUp/NPSignUp.html',
    controller: 'NPSignUpCtrl'
  });
}])


.controller('NPSignUpCtrl', ['$scope','md5', '$firebaseAuth', '$location', '$rootScope', '$window',
    function ($scope, md5, $firebaseAuth, $location, $rootScope, $window) {
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
    $scope.panels = [{"Categories":null,"People":People, "Communicate": Communicate},{"Arts":Arts, "Technology":Technology,
                          "Environment":Environment},{"Business": Business, "Health":Health, "30,000":null}];

    $scope.checkModel = {

    };

    $scope.uploadFile = function(){

    }

    function registerUser(email, password, phoneNumber, skills, username, aboutNP, needs, x){

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .catch(function(error){//this error checking should catch already exists type stuff
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log("Error: " + errorMessage);//TODO: add something here to do a fancy pop up if error is thrown
                return false;
            })
            .then(function(){
                console.log("successfully authorized user");

                //sign in newly authorized user
                firebase.auth().signInWithEmailAndPassword(email, password)
                .then(function(){
                         console.log("successfully signed in new user");

                         //retrieve numNPs
                         var numNP = firebase.database().ref('numNonprofits');
                         numNP.once("value")
                          .then(function(snapshot) {

                            var num = snapshot.val();
                            firebase.database().ref('nonprofitEmails/' + num).set({
                                email: email
                            })
                            var hash = md5.createHash(email);
                            firebase.database().ref('nonprofit/' + hash).set({
                                username: username,
                                email: email,
                                phone: phoneNumber,
                                skills: skills,
                                about: aboutNP,
                                needs: needs
                            }).then(function(){
                                var _validFileExtensions = [".jpg", ".jpeg", ".bmp", ".gif", ".png"];
                                //var x = document.getElementById('nameImg');
                                console.log(x);
                                if(x.files.length > 0){
                                  console.log(x.files.length);
                                  var file = x.files[0];
                                  var blnValid = false;
                                  for (var j = 0; j < _validFileExtensions.length; j++) {
                                    var sCurExtension = _validFileExtensions[j];
                                    if (file.name.substr(file.name.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
                                      blnValid = true;
                                      var ref = firebase.storage().ref('nonprofitProfilePictures/' + hash + '/profile_picture');
                                      ref.put(file).then(function(snapshot){
                                        console.log("Uploaded file!");
                                      });
                                    }
                                  }
                                  if('name' in file){
                                    console.log(file.name);
                                  }
                                  if('size' in file){
                                    console.log(file.size);
                                  }
                                }
                            })
                            .catch(function(error){
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
        var aboutNP = $scope.about;
        var needs = $scope.needs;
        var x = document.getElementById('inputImage');

        console.log(x);
        angular.forEach($scope.checkModel.value, function (value, key) {
          if (value) {

            console.log(key);
            skills.push(key);
          }
        });

        console.log(skills);
        if(!$scope.regForm.$invalid){
            console.log("Valid form Submission");

            var registered = registerUser(txtEmail, txtPassword,phoneNumber, skills, username, aboutNP, needs, x);

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
        $scope.about = '';
        $scope.needs = '';
    };
}]);
