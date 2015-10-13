angular.module('app').value('mvToastr', toastr);

/*
angular.factory เป็นรูปแบบหนึ่งของ Provider มี 5 type
1. Provider
2. Value
3. Factory
4. Service
5. Constant
 */
angular.module('app').factory('mvNotifier', function(mvToastr){
  return {
    notify:function(msg){
      mvToastr.success(msg);
      console.log(msg);
    }
  }
});


