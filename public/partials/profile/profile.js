'use strict';

angular.module('tutorialWebApp.profile', ['ngRoute','firebase','ngSanitize'])

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
    $scope.picUrl = 'profilePictures/';
    $scope.image = '';

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
    open: false
    };

    $scope.checkModel = {

    };

    $scope.project = {

    };

    $scope.notifications = {

    };

    $scope.openProject = false;

    $scope.acceptInterest = function(emailHash, key, notifKey){
        console.log("acceptInterest");
        console.log(emailHash);
        console.log(key);
        console.log(notifKey);

        var profNotification = '<p>' + $scope.email + ' has accepted your interest in the project!</p>';
        var profkey = firebase.database().ref('Professors/' + emailHash).child('notifications').push().key;
        var updates = {};
        updates['projects/' + key + '/status/'] = 'IP';
        updates['projects/' + key + '/professor/'] = emailHash;
        updates['Professors/' + emailHash + '/notifications/' + profkey] = profNotification;
        firebase.database().ref().update(updates);

        var notifRef = firebase.database().ref('nonprofit/' + $scope.hash + '/notifications/' + notifKey);
        notifRef.remove()
          .then(function() {
            console.log("Remove succeeded.")
          })
          .catch(function(error) {
            console.log("Remove failed: " + error.message)
          });

          $scope.$apply();

    }

    $scope.rejectInterest = function(emailHash, key, notifKey){
      console.log("rejectInterest");
      console.log(emailHash);
      console.log(key);
      console.log(notifKey);

      var profNotification = '<p>' + $scope.email + ' has rejected your interest in the project!</p>';
      var profkey = firebase.database().ref('Professors/' + emailHash).child('notifications').push().key;
      var updates = {};

      updates['Professors/' + emailHash + '/notifications/' + profkey] = profNotification;

      firebase.database().ref().update(updates);

      var notifRef = firebase.database().ref('nonprofit/' + $scope.hash + '/notifications/' + notifKey);
      notifRef.remove()
        .then(function() {
          console.log("Remove succeeded.")
        })
        .catch(function(error) {
          console.log("Remove failed: " + error.message)
        });

      var interestRef = firebase.database().ref('Professors/' + emailHash + '/interests/' + key);
      interestRef.remove()
        .then(function(){
          console.log("Remove Succeeded");
        })
        .catch(function(error){
          console.log("Remove failed: " + error.message);
        });

        $scope.$apply();
    }

    $scope.deleteNotif = function(key){
      console.log("delete " + key);
      var notifRef = firebase.database().ref('nonprofit/'+ $scope.hash + '/notifications/' + key);
      notifRef.remove()
        .then(function() {
          console.log("Remove succeeded.")
        })
        .catch(function(error) {
          console.log("Remove failed: " + error.message)
        });

        $scope.$apply();
    }

    $scope.createProject = function(){
        var name = $scope.project.Name;
        var description = $scope.project.Description;
        var skills = [];
        $scope.numProjects;

        for(var box in $scope.checkModel.value){
            if($scope.checkModel.value[box] === true){
                skills.push(box);
            }
        }
        console.log(skills);
        //figure out why the fuck idiot proofing isn't working here
        var ref = firebase.database().ref('numProjects/');
        ref.once("value").then(function(snapshot){
            $scope.numProjects = snapshot.val();
            console.log($scope.numProjects);

            var hash = md5.createHash($scope.email);

            var newProj = firebase.database().ref('projects/' + $scope.numProjects);
            newProj.set({
                nonprofit: hash,
                name: name,
                description: description,
                skills: skills,
                status: 'open'
            });

            var updates = {};
            updates['nonprofit/' + hash + '/projects/' + $scope.numProjects] = 'IP';
            firebase.database().ref().update(updates);

            firebase.database().ref('numProjects/').set($scope.numProjects + 1);
        });

        $scope.status.open = false;
    }

    $scope.submitPic = function(){
      var NPref = firebase.database().ref('nonprofit/' + hash);
      var updates = {};
      var filename = document.getElementById('file');
      console.log(filename);
      console.log(filename.files[0].name);
      //https://s3.amazonaws.com/thirtythousandhandsimages/profilePictures/1493d0f6731e9073840b47f9d586f7b8/december.jpg
      updates['nonprofit/'+ hash +'/picture'] = 'https://s3.amazonaws.com/thirtythousandhandsimages/profilePictures/' + hash + '/' + filename.files[0].name;
      firebase.database().ref().update(updates);
    }


    if(firebase.auth().currentUser != null){
        email = firebase.auth().currentUser.email;
        console.log(email);


        var hash = md5.createHash(email);
        $scope.hash = hash;

        var notificationRef = firebase.database().ref('nonprofit/' + hash + '/notifications');
        notificationRef.on('child_removed', function(snapshot){
          var NPref = firebase.database().ref('nonprofit/' + $scope.hash);
          console.log("child was removed");
          NPref.once("value").then(function(snapshot){
            $scope.notifications = snapshot.child('notifications/').val();
            $scope.$apply();
          });
        });

        var NPref = firebase.database().ref('nonprofit/' + hash);
        NPref.once("value")
            .then(function(snapshot){
                if(snapshot != null){
                    $scope.email = email;
                    $scope.phone = snapshot.child('phone/').val();
                    $scope.image = snapshot.child('picture/').val();
                    $scope.username = snapshot.child('username/').val();
                    $scope.narrative = snapshot.child('narrative/').val();
                    $scope.about = snapshot.child('about/').val();
                    $scope.skills = snapshot.child('skills/').val();
                    $scope.website = snapshot.child('website/').val();
                    //console.log(snapshot.val());
                    $scope.notifications = snapshot.child('notifications/').val();
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
                            $scope.notifications = snapshot.child('notifications/').val();
                    console.log(snapshot.child('notifications/').val());
                            $scope.$apply();
                        });
                    }
                });


    } else{
        //$scope.userSignedIn = true;
    }
    }])



  //make separate list of nums and emails
