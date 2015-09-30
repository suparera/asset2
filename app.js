var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


var app = express();
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
// view engine setup
app.locals.basedir= path.join(__dirname, 'views');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
if(env === 'development'){
  app.locals.pretty = true;
}

//// Middleware part
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'multi vision unicorns',
  resave:true,
  saveUninitialized:true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

//Mongoose Section
mongoose.connect('mongodb://localhost/multivision');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error...'));
db.once('open', function callback(){
  console.log('multivision db is opened.');
})
// Create Schema, Model in mongodb
var messageSchema = mongoose.Schema({message: String});
var Message = mongoose.model('Message',messageSchema);
// messageDoc that return from mongodb when findOne() it,
var mongoMessage;
Message.findOne().exec(function (err, messageDoc) {
  mongoMessage = messageDoc.message;
  console.log('mongoMessage = ' + mongoMessage);
});
//// User in mongoose section : Create Schema, Model , and check existing of user, if not, create new one for Test
var userSchema = mongoose.Schema({
  firstName:String,
  lastName:String,
  userName:String
});
var User = mongoose.model('User', userSchema);
User.find({}).exec(function(err, collection){
  if(collection.length === 0 ) {
    User.create({firstName:'Anna', lastName:'Kunishkowa', userName:'anna'});
    User.create({firstName:'Bee', lastName:'Kresendo', userName:'bee'});
    User.create({firstName:'Cat', lastName:'Zeetajone', userName:'cat'});
    User.create({firstName:'Daril', lastName:'WalkingDead', userName:'daril'});
  }
});


//// Passport Section, use User Model to verify user login
passport.use(new LocalStrategy(function(username,password,done){
  User.findOne({userName:username}).exec(function(err,user){
    return (user ? done(null, user) : done(null, false));
  });
}));
passport.serializeUser(function (user, done) {
  if(user){
    done(null, user._id);
  }
});
passport.deserializeUser(function(id,done){
  User.findOne({_id: id}).exec(function (err, user) {
      return (user ? done(null, user) : done(null, false));
    }
  );
});



///// ROUTE Config
//var routes = require('./routes/index');
app.get('/', function(req, res, next) {
  res.render('../public/app/index', { title: 'Express',mongoMessage:mongoMessage, test:"Testing" });
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


app.post('/login', function(req,res,next) {
  //// Route for login, must create auth middleware for accept authentication
  var auth = passport.authenticate('local',function(err,user){
    if(err){return next(err);}
    if(!user){ res.send({success:false})}
    req.logIn(user, function(err) {
      if(err){return next(err)}
      res.send({success: true, user: user});
    })
  });
  auth(req, res, next);
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
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
