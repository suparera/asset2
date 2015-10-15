var express = require('express');

var path = require('path');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var app = express();
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// make Jade view generated code easy to read
if(env === 'development'){
  app.locals.pretty = true;
}
// call config, and send env as parameter
/*
_01_config : module is key(String) : Value (Config Object)
 */
var config = require('./config/_01_config')[env];

console.log("config.rootPath = " + config.rootPath);
/*
 การส่ง Parameter แบบนี้ จะเป็น Parameter ใน Exports function ฝั่งรับ ประกาศโดย
 module.exports = function(app, config) {
    ....
 }
 */
require('./config/_02_express')(app, config);

require('./config/_03_mongoose')(config);

require('./config/_04_passport')();

var auth = require('./config/auth');









///// ROUTE Config
//var routes = require('./routes/index');
app.get('/', function(req, res, next) {
  res.render('../public/app/index', { title: 'Express', test:"Testing" });
});
var users = require('./routes/users');
//app.use('/', routes);
app.use('/users', users);
// Route /app/subApp to /public/app/*

//app.get('/app/:subApp/:page', function(req,res){
//  console.log('app.js: route :/app/:subApp/:page called, subApp=' + req.params.subApp+', page='+req.params.page);
//  ////// Path here reference from /views path, so think your current path = /views
//  res.render('../public/app/'+ req.params.subApp+'/'+req.params.page);
//});

app.get('/app/*', function(req,res){
  console.log('app.js: route :/app/* =' + req.params[0]);
  ////// Path here reference from /views path, so think your current path = /views
  res.render('../public/app/'+ req.params[0]);
});


app.post('/login', auth.authenticate);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log("route for error handler")
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
