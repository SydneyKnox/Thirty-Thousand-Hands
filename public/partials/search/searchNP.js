'use strict';

angular.module('tutorialWebApp.searchNP', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/search', {
    templateUrl: 'partials/search/searchNP.html',
    controller: 'searchCtrl'
  });
}])

.controller('searchCtrl', ['$scope','md5', '$firebaseAuth', '$route', '$location', '$rootScope', '$window',
    function ($scope,md5, $firebaseAuth, $route, $location, $rootScope, $window){

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
        $scope.filteredPage = false;

        $scope.checkModel = {

        };

        $scope.list = {

        }

        $scope.showCategories = {

        }

        $scope.numChecked = 0;

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
                for(var key in $scope.showCategories){ //showCategories is the one that is email:T/F
                    $scope.showCategories[key] = false;
                }
                $scope.numChecked = $scope.numChecked +1;
                //go through each np, check if it's skills include the checked tag
                //if yes, set that np to true in the email list.
                for(var key in $scope.list){
                    if($scope.list[key].skills.includes(category.subcategory)){//for each np, if that np's skills list contains the checked box, then change showCat
                        $scope.showCategories[$scope.list[key].email] = true;
                        console.log("adding: " + $scope.list[key].email);
                    }
                }
                //$scope.showCategories[category] = true;//so that the one you just checked
            }else{
                //console.log(category.subcategory);
                //if the box is (now?) checked
                if(document.getElementById(category.subcategory).checked){
                    console.log(category.subcategory + "checked");
                    //for each email in the np object list
                    $scope.numChecked = $scope.numChecked +1;
                    for(var key in $scope.list){
                        //if this np includes the checked tag
                        if($scope.list[key].skills.includes(category.subcategory)){//for each np, if that np's skills list contains the checked box, then change showCat
                            //then make that np email true
                            $scope.showCategories[$scope.list[key].email] = true;
                            console.log($scope.list[key].email);
                        }
                    }
                    //$scope.showCategories[category.subcategory] = true;
                }else{
                    //box is (now?) unchecked
                    //for each email in the email/np object list
                    $scope.numChecked = $scope.numChecked - 1;
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
                                $scope.showCategories[$scope.list[key].email] = false;
                                console.log($scope.list[key].email);
                            }
                        }
                    }
                    //$scope.showCategories[category.subcategory] = true;
                }

                if($scope.numChecked == 0){
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

        $scope.getNP = function(email){
          //console.log("wtf");
          var ref = firebase.database().ref('nonprofitEmails/');
          ref.once("value").then(function(snapshot){
            snapshot.forEach(function(np){
              if(np.child('email/').exists()){
                if(np.child('email/').val() === email){
                    console.log(np.child('email/').val());
                    console.log(np.key);
                    $location.url('/nonprofit/' + np.key);
                    $route.reload();
                }
              }
            })
          })
        }

        var ref = firebase.database().ref('nonprofit/');

        ref.once("value").then(function(snapshot){
            snapshot.forEach(function(np){
                $scope.list[np.val().email] = np.val();
                //console.log(np.val().email);

               // console.log(np.val());
               // console.log($scope.list[np.val()]);
            });

            var nums = firebase.database().ref('nonprofitEmails/');
            nums.once("value").then(function(nums){
              nums.forEach(function(np){
              //  console.log(np.val());
                if(np.child("email/").exists()){
                  //console.log(np.child("email/").val());
                  $scope.list[np.child("email/").val()]["index"] = np.key;
                //  console.log($scope.list[np.child("email/").val()]);
                }
              })
            });

            for(var key in $scope.list){
                $scope.showCategories[key] = true;
            }

            //console.log($scope.showCategories);
            $scope.$apply();
            //console.log($scope.list);
        })

    }]);
