'use strict';

angular.module('tutorialWebApp.searchProjects', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/searchProjects', {
    templateUrl: 'partials/search/searchProjects.html',
    controller: 'searchProjectsCtrl'
  });
}])

.controller('ModalDemoCtrl', function($uibModal, $log, $document){
    var $ctrl = this;
    $ctrl.key;
    $ctrl.open = function(key,value, profHash){
        var modalInstance = $uibModal.open({
            animation: true,
            ariaDescribedBy: 'modal-body',
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            controllerAs: '$ctrl',
            resolve: {
                key: function(){
                    return key;
                },
                value: function(){
                    return value;
                },
                profHash: function(){
                    return profHash;
                }
            }
        });


    };

})

.controller('ModalInstanceCtrl', function ($uibModalInstance,key, value, profHash) {
  var $ctrl = this;

  $ctrl.key = key;
  $ctrl.profHash = profHash;
  $ctrl.value = value;
  $ctrl.email = firebase.auth().currentUser.email;

  $ctrl.ok = function () {
    var buttonthing = document.getElementById(value.name);
    console.log(buttonthing);
    buttonthing.disabled = true;
    buttonthing.value = "Awaiting Non-profit Response";
    console.log(buttonthing);
    var ref = firebase.database().ref('nonprofit/' + value.nonprofit + '/notifications/');
    ref.once("value").then(function(snapshot){
       var numNotes = snapshot.numChildren();
       //<p>fundamentals@class.com is interested in your project proj2!</p>
       // <p style = "pull-right;"><a ng-click="acceptInterest("229a4313b993e5b95347ff52a4906c16")";>Accept</a></p>
       var buttonHTML = '<p style = "pull-right;"><a ng-click="acceptInterest(\'' + $ctrl.profHash + '\',\''+ $ctrl.key +'\');">Accept</a></p>'
       var notifHTML = '<p>' + $ctrl.email + ' is interested in your project ' + value.name + '!</p>' + buttonHTML;
       var key = firebase.database().ref('nonprofit/'+value.nonprofit).child('notifications').push().key;
       var updates = {};
       updates['nonprofit/' + value.nonprofit + '/notifications/' + key] = notifHTML;
       firebase.database().ref().update(updates);
       //var setRef = firebase.database().ref('nonprofit/' + value.nonprofit + '/notifications/' + numNotes);
       //setRef.set(notifHTML);
    });
    var profRef = firebase.database().ref('Professors/' + $ctrl.profHash);
    profRef.once("value").then(function(snapshot){
        //var key = firebase.database().ref('Professors/' + $scope.profHash).child('interests').push().key;
        var updates = {};
        updates['Professors/'+$ctrl.profHash+'/interests/' + key] = true;
        firebase.database().ref().update(updates);
    });
    $uibModalInstance.close();
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
})

.controller('searchProjectsCtrl', ['$scope','md5', '$firebaseAuth', '$location', '$rootScope', '$window',
    function ($scope,md5, $firebaseAuth, $location, $rootScope, $window){

        $scope.isCollapsed = false;
        $scope.isCollapsedHorizontal = false;
        $scope.clicked = false;
        $scope.ifProf = false;
        $scope.ProfName = '';
        $scope.profHash = '';
        var People = ["Education", "Early Childhood Studies", "Psychology", "Social Work", "Sociology", "Anthropology", "Political Science", "Legal Services"];
        var Communicate = ["Mass Communications", "Journalism", "Grant and Technical Writing", "Public Relations", "Event Planning", "Languages and Interpretation"];
        var Arts = ["Creative Writing", "Visual Arts", "Design", "Performing Arts"];
        var Technology = ["Engineering", "Computer Science", "Analytics"];
        var Environment = ["Sustainability", "Natural Sciences", "Urban and Regional Planning", "Gardening"];
        var Business = ["Accounting", "Marketing", "Entrepreneurship", "Statistics", "Economy", "Fundraising and Philanthropy"];
        var Health = ["Nursing", "Pre-Med", "Public Health", "Global Health"];
        $scope.categories = {"People": People, "Communicate": Communicate, "Arts": Arts, "Technology": Technology,
                             "Environment": Environment, "Business": Business, "Health": Health};
        $scope.filteredPage = false;

        $scope.checkModel = {

        };

        $scope.list = {

        }

        $scope.showCategories = {

        }

        $scope.numChecked = 0;

        // $scope.submitInterest = function(index, value){

            // var buttonthing = document.getElementById(value.name);
            // console.log(buttonthing);
            // buttonthing.disabled = true;
            // var ref = firebase.database().ref('nonprofit/' + value.nonprofit + '/notifications/');
            // ref.once("value").then(function(snapshot){
               // var numNotes = snapshot.numChildren();
               // var buttonHTML = '<p style = "pull-right;"><a ng-click="acceptInterest();">Accept</a></p>'
               // var notifHTML = '<p>' + $scope.ProfName + ' is interested in your project ' + value.name + '!</p>' + buttonHTML;
               // var key = firebase.database().ref('nonprofit/'+value.nonprofit).child('notifications').push().key;
               // var updates = {};
               // updates['nonprofit/' + value.nonprofit + '/notifications/' + key] = notifHTML;
               // firebase.database().ref().update(updates);
               //var setRef = firebase.database().ref('nonprofit/' + value.nonprofit + '/notifications/' + numNotes);
               //setRef.set(notifHTML);
            // });

        // }



        $scope.checkShow = function(np){
            //console.log(np.skills);
            np.skills.forEach(function(skill){
                if($scope.showCategories[skill] == true){
                    console.log("include np");
                    return true;
                }else{
                    return false;
                }
            })

        }

        $scope.filterResults = function(category){
            //console.log(category);
            if($scope.filteredPage == false){
                $scope.filteredPage = true;//list is the one that is email:object
                //set all the tags back to false
                $scope.numChecked = $scope.numChecked + 1;
                console.log($scope.numChecked);
                for(var key in $scope.showCategories){ //showCategories is the one that is email:T/F
                    $scope.showCategories[key] = false;
                }
                //go through each np, check if it's skills include the checked tag
                //if yes, set that np to true in the email list.
                for(var key in $scope.list){
                  console.log(key);
                  console.log($scope.list);
                  console.log(category.subcategory);
                  console.log($scope.list[key].skills);
                  console.log($scope.showCategories);
                    if($scope.list[key].skills.includes(category.subcategory)){//for each np, if that np's skills list contains the checked box, then change showCat
                        console.log("wht");
                        $scope.showCategories[key] = true;
                        console.log("adding: " + $scope.list[key].name);
                    }
                }
                //$scope.showCategories[category] = true;//so that the one you just checked
            }else{
                //console.log(category.subcategory);
                //if the box is (now?) checked
                if(document.getElementById(category.subcategory).checked){
                    console.log(category.subcategory + "checked");
                    //for each email in the np object list
                    $scope.numChecked = $scope.numChecked + 1;
                    console.log($scope.numChecked);
                    for(var key in $scope.list){
                        //if this np includes the checked tag
                        if($scope.list[key].skills.includes(category.subcategory)){//for each np, if that np's skills list contains the checked box, then change showCat
                            //then make that np email true
                            $scope.showCategories[$scope.list[key].name] = true;
                            console.log($scope.list[key].name);
                        }
                    }
                    //$scope.showCategories[category.subcategory] = true;
                }else{
                    //box is (now?) unchecked
                    //for each email in the email/np object list
                    $scope.numChecked = $scope.numChecked - 1;
                    console.log($scope.numChecked);
                    for(var key in $scope.list){
                        //if that np's skills includes the unchecked box
                        if($scope.list[key].skills.includes(category.subcategory)){//for each np, if that np's skills list contains the checked box, then change showCat
                            $scope.removeNP = true;
                            $scope.list[key].skills.forEach(function(skill){
                                if(document.getElementById(skill).checked){
                                    $scope.removeNP = false;
                                }
                            });
                            if($scope.removeNP){
                                $scope.showCategories[$scope.list[key].name] = false;
                                console.log($scope.list[key].name);
                            }
                        }
                    }
                    //$scope.showCategories[category.subcategory] = true;
                }

                if($scope.numChecked === 0){
                  console.log("back to 0");
                  for(var key in $scope.showCategories){
                    $scope.showCategories[key] = true;
                  }

                  $scope.filteredPage = false;
                }
            }
            //console.log($scope.showCategories);
            //$scope.$apply();

        }


        var getData = function(){
            var ref = firebase.database().ref('projects/');

            ref.once("value").then(function(snapshot){
                for( var key in snapshot.val()){
                    console.log(key);
                    console.log(snapshot.val()[key]);

                    if(snapshot.val()[key].status === "open"){
                        $scope.list[key] = snapshot.val()[key];
                    }
                }
                console.log($scope.list);
                // snapshot.forEach(function(project){
                    // if(project.val().status === "open"){
                        // $scope.list[project.val().name] = project.val();
                    // }
                    // console.log(project.val().key);
                   //console.log($scope.list[np.val()]);
                // })

                for(var key in $scope.list){
                    $scope.showCategories[key] = true;
                }

                if(firebase.auth().currentUser != null){
                    console.log("someone logged in");

                    var hash = md5.createHash(firebase.auth().currentUser.email);
                    var ref = firebase.database().ref('Professors/'+hash);
                    ref.once("value").then(function(snapshot){
                        if(snapshot.exists()){
                            $scope.isProf = true;
                            $scope.ProfName = snapshot.child('username/').val();
                            $scope.profHash = hash;
                            $scope.interests = snapshot.child('interests/').val();
                            console.log($scope.interests);
                            //console.log($scope.ProfName);
                            //console.log("isProf");
                            $scope.$apply();
                        }else{
                            $scope.isProf = false;
                            console.log("isn'tProf");
                            $scope.$apply();
                        }
                    });

                }

                console.log($scope.showCategories);
                $scope.$apply();
            });
        }

        //checkIfProf();
        getData();
}]);
