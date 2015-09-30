"use strict";


var indexApp = angular.module('IndexApp',['ngResource','ngRoute']);


indexApp.config(function($routeProvider, $locationProvider){
  $locationProvider.html5Mode({
    enabled:true,
    requireBase: false
  });

  $routeProvider
    .when('/',{templateUrl:'partials/main', controller:'mainCtrl'});
});

indexApp.controller('mainCtrl', function($scope){
  $scope.myVar = "Hello from mainCtrl";
})
