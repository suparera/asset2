/**
 * This service will provide authenticate function
 * to refactory code in mvNavBarLoginCtrl.js
 * it's function only is Authenticate or not
 * $q is angular's service that helps you run functions asynchronously
 *    This is an implementation of promises/deferred objects inspired by Kris Kowal's Q.
 */
angular.module('app').factory('mvAuth', function($http, mvIdentity, $q) {
  return {
    authenticateUser: function(username, password){
      console.log('mvAuth.js authenticateUser() called.');
      // dfd :defer used for communicate back to Caller:mvNavbarLoginCtrl.js
      var dfd = $q.defer();

      // authenticate with server express in  /asset2/app.js (by express routing)
      $http.post('/login', {username:username, password:password}).then(function(response) {
        if(response.data.success){
          mvIdentity.currentUser = response.data.user;
          // send true, show successful login.
          dfd.resolve(true);
        } else {
          // send false , show failed login
          dfd.resolve(true);
        }

      });
      return dfd.promise;
    }
  }
})
