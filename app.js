var weatherApp = angular.module("weatherApp",['ngRoute','ngResource']);

//Directives

weatherApp.directive("weatherRep",function(){
    return {
        restrict: 'E',
        templateUrl: 'directives/weatherReport.html',
        replace: true,
        scope: {
            w: "=",
            convertDate: "&",
            convertFh: "&",
            dateFormat: "@"
        }
    }
});

//Services

weatherApp.service("cityService", function(){
    this.city = "Union City, CA";
});

//Routes

weatherApp.config(function($routeProvider){
    $routeProvider.when("/",{
        templateUrl: 'pages/home.html',
        controller: 'homeController'
    })
    .when('/forecast', {
        templateUrl: 'pages/forecast.html',
        controller: 'forecastController'
    })
    .when('/forecast/:days',{
        templateUrl: 'pages/forecast.html',
        controller: 'forecastController'
    })
});

//Controllers
weatherApp.controller('homeController', ['$scope','cityService',function($scope,cityService){
    $scope.city = cityService.city;
    $scope.$watch("city",function(newVal,oldVal){
        cityService.city = $scope.city;
    });
}]);

weatherApp.controller('forecastController', ['$scope','cityService' , '$resource', '$routeParams', function($scope, cityService,$resource,$routeParams){
    $scope.days = $routeParams.days || 2;
    $scope.city = cityService.city;
    $scope.weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily",{callback: "JSON_CALLBACK"},{get: {method: "JSONP"}});
    $scope.weatherResult = $scope.weatherAPI.get({q: $scope.city, cnt: $scope.days});
    $scope.convertToFh = function(degK){
        return Math.round((1.8 * (degK -273))+32);
    }
    $scope.convertToDate = function(dat){
        return new Date(dat*1000);
    }
}]);
