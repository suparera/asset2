angular.module('app').controller('mvNavBarLoginCtrl',function($scope, $http, mvIdentity, mvNotifier, mvAuth) {
  $scope.identity = mvIdentity;
  $scope.signin = function(username, password) {
    mvAuth.authenticateUser(username,password).then(function(success){
      console.log('mvNavbarLoginCtrl.js success =' + success);
      if(success){
        mvNotifier.notify('You have successfully Signed in!');
      } else {
        mvNotifier.notify('Username / Password combination incorrect!');
      }
    });
  };
})
