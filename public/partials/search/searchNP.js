'use strict';

angular.module('tutorialWebApp.searchNP', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/search', {
    templateUrl: 'partials/search/searchNP.html',
    controller: 'searchCtrl'
  });
}])

.controller('searchCtrl', ['$scope','md5', '$firebaseAuth', '$location', '$rootScope', '$window', 
    function ($scope,md5, $firebaseAuth, $location, $rootScope, $window){
        
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
            if($scope.filteredPage == false){
                $scope.filteredPage = true;
                for(var key in $scope.showCategories){ //list is the one that is email:object
                    $scope.showCategories[key] = false;//showCategories is the one that is email:T/F
                }
               // $scope.showCategories[category] = true;
            }
            console.log(category.subcategory);
            for(var key in $scope.list){
                if($scope.list[key].skills.includes(category.subcategory)){//for each np, if that np's skills list contains the checked box, then change showCat
                    $scope.showCategories[$scope.list[key].email] = true;
                    console.log($scope.list[key].email);
                }
            }
            $scope.showCategories[category.subcategory] = true;
            //console.log($scope.showCategories);
            //$scope.$apply();
            
        }
        var ref = firebase.database().ref('nonprofit/');
        
        ref.once("value").then(function(snapshot){
            snapshot.forEach(function(np){
                $scope.list[np.val().email] = np.val();
               // console.log(np.val());
               // console.log($scope.list[np.val()]);
            })
            
            for(var key in $scope.list){
                $scope.showCategories[key] = true;
            }
            
            //console.log($scope.showCategories);
            $scope.$apply();
        })
    }]);