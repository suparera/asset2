/**
 * Created by suparera on 13/10/2015.
 */
var mongoose = require('mongoose');

/*
crypto : used for salt and hashing
 */
var crypto = require('crypto');

module.exports = function(config) {
  //Mongoose Section
  mongoose.connect(config.db);
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error...'));
  db.once('open', function callback(){
    console.log('multivision db is opened.');
  })
// Create Schema, Model in mongodb
  var messageSchema = mongoose.Schema({
    message: String
  });

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
    username:String,
    salt:String,
    hashed_pwd:String
  });

  //Note : add user method for authenticate with password
  userSchema.methods = {
    authenticate: function (passwordToMatch) {
      return hashPwd(this.salt, passwordToMatch) === this.hashed_pwd;
    }
  }

  var User = mongoose.model('User', userSchema);

  User.find({}).exec(function(err, collection){
    if(collection.length === 0 ) {
      console.log('mongoose.js: no users, then create 4 users');
      var salt, hash;

      //Note: Not so strong password(same as username) just for test only
      salt = createSalt();
      hash = hashPwd(salt, 'anna');
      User.create({firstName:'Anna', lastName:'Kunishkowa', username:'anna', salt:salt, hashed_pwd:hash});
      salt = createSalt();
      hash = hashPwd(salt, 'bee');
      User.create({firstName:'Bee', lastName:'Kresendo', username:'bee', salt:salt, hashed_pwd:hash});
      salt = createSalt();
      hash = hashPwd(salt, 'cat');
      User.create({firstName:'Cat', lastName:'Zeetajone', username:'cat', salt:salt, hashed_pwd:hash});
      salt = createSalt();
      hash = hashPwd(salt, 'daril');
      User.create({firstName:'Daril', lastName:'WalkingDead', username:'daril', salt:salt, hashed_pwd:hash});
    }
  });
}

function createSalt(){
  return crypto.randomBytes(128).toString('base64');
}

function hashPwd(salt,pwd){
  // hmac hased based mesage authentication code.
  var hmac = crypto.createHmac('sha1', salt);
  return hmac.update(pwd).digest('hex');
}
