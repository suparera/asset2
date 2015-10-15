/**
 * Created by suparera on 13/10/2015.
 */
var passport = require('passport');

exports.authenticate = function(req,res,next) {
  console.log("auth.js authenticate() called.");
  //// Route for login, must create auth middleware for accept authentication
  var authRoute = passport.authenticate('local',function(err,user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.send({success: false})
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err)
      }
      res.send({success: true, user: user});
    });
  })
  authRoute(req, res, next);
}