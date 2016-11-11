'use strict';

angular.module('tutorialWebApp.searchProjects', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/searchProjects', {
    templateUrl: 'partials/search/searchProjects.html',
    controller: 'searchProjectsCtrl'
  });
}])

.controller('searchProjectsCtrl', ['$scope','md5', '$firebaseAuth', '$location', '$rootScope', '$window', 
    function ($scope,md5, $firebaseAuth, $location, $rootScope, $window){
        
        $scope.isCollapsed = false;
        $scope.isCollapsedHorizontal = false;
        $scope.clicked = false;
        $scope.ifProf = false;
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
                //go through each np, check if it's skills include the checked tag 
                //if yes, set that np to true in the email list. 
                for(var key in $scope.list){
                    if($scope.list[key].skills.includes(category.subcategory)){//for each np, if that np's skills list contains the checked box, then change showCat
                        $scope.showCategories[$scope.list[key].name] = true;
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
            }
            //console.log($scope.showCategories);
            //$scope.$apply();
            
        }
        
        var checkIfProf = function(){
            console.log(firebase.auth().currentUser);
            if(firebase.auth().currentUser != null){
                console.log("someone logged in");
                
                var hash = md5.createHash(firebase.auth().currentUser.email);
                var ref = firebase.database().ref('Professors/'+hash);
                ref.once("value").then(function(snapshot){
                    if(snapshot.exists()){
                        $scope.isProf = true;
                        console.log("isProf");
                    }else{
                        $scope.isProf = false;
                        console.log("isn'tProf");
                    }
                });
                $scope.$apply();
            }
        }
        
        var getData = function(){
            var ref = firebase.database().ref('projects/');
            
            ref.once("value").then(function(snapshot){
                snapshot.forEach(function(project){
                    $scope.list[project.val().name] = project.val();
                    //console.log(project.val());
                   // console.log($scope.list[np.val()]);
                })
                
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
                            console.log("isProf");
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