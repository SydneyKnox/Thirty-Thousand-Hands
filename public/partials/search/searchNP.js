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

        $scope.checkModel = {
        
        };
        
        $scope.list = {
            
        }
        
        $scope.showCategories = {
            
        }

        $scope.filterResults = function(category){
            console.log(category.subcategory);
            $scope.showCategories[category.subcategory] = false;
            console.log($scope.showCategories);
            //$scope.$apply();
        }
        var ref = firebase.database().ref('nonprofit/');
        
        ref.once("value").then(function(snapshot){
            //$scope.list = snapshot.val();
            
            snapshot.forEach(function(np){
               // console.log(np);
               // console.log(np.val());
               // np.val()["show"] = true;
                //console.log(np.val()["show"]);
                $scope.list[np.val().email] = np.val();
                //console.log($scope.list);
            })
            
            for(var key in $scope.categories){
                //console.log(key);
                //console.log($scope.categories[key]);
                for(var categ in $scope.categories[key]){
                   // console.log(categ);
                   //console.log($scope.categories[key][categ]);
                    $scope.showCategories[$scope.categories[key][categ]] = true;
                }
            }
            
            console.log($scope.showCategories);
            // var items = snapshot.val();
            // console.log(items);
            // var size = Object.keys(items).length;            
            // console.log(size);
            // for(var i=0;i<size;i++){
                // items[i].show = true;
                // console.log(items(i));
            // }
            
            $scope.$apply();
        })
    }]);