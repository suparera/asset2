/*
available params
1. app
2. config
 */
var express = require('express');
var session = require('express-session');
var stylus = require('stylus');
var passport = require('passport');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
module.exports = function(app, config) {
  // Jade view Engine basedir config
  app.locals.basedir= config.rootPath+"/views";
  app.set('views', config.rootPath+"/views");
  app.set('view engine', 'jade');


//// Middleware part
// uncomment after placing your favicon in /public
  app.use(favicon(config.rootPath+"/public/favicon.ico"));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());

// Session config
  app.use(session({
    secret: 'multi vision unicorns',
    resave:true,
    saveUninitialized:true
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(require('stylus').middleware(config.rootPath+"/public"));
  app.use(express.static(config.rootPath+"/public"));
}


