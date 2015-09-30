"use strict";

var app = angular.module('app',['ngResource','ngRoute']);
app.config(function($routeProvider, $locationProvider){
  console.log('app.js (angular) in public called.');
  $locationProvider.html5Mode({
    enabled:true,
    requireBase: false
  });

  $routeProvider
    .when('/',{templateUrl:'/app/main/main', controller:'mvMainCtrl'});
});

app.controller('mainCtrl', function($scope){
  $scope.myVar = "Hello from mainCtrl";
})
