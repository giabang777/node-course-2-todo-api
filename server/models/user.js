const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      // validator: validator.isEmail,
      validator: value=>validator.isEmail(value),
      message: '{VALUE} là email không khả dụng!'
    }
  },
  password: {
    type: String,
    minlength: 6,
    required: true
  },
  tokens: [
    {
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }
  ]
});

UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;
  try {
    decoded=jwt.verify(token,"abc123")
  } catch (e) {
    return Promise.reject("Token is invalid!");
  }

  return User.findOne({
    "_id":decoded._id,
    "tokens.access":"auth",
    "tokens.token":token
  });
};

UserSchema.statics.findByCredentials = function (email,password) {
  return User.findOne({email:email}).then((doc) => {
    if (!doc) {
      // return res.status(404).send({"error":"User is invalid!"});
      return Promise.reject("User is invalid!")
    };
    return bcrypt.compare(password,doc.password).then((res) => {
      if (res) {
        return Promise.resolve(doc)
      }
      else {
        return Promise.reject("Wrong password!")
      }
    })
  });
};

// UserSchema.methods.toJSON=function () {
//   var user = this;
//   return _.pick(user,['_id','email']);
// };
UserSchema.methods.toCustomJSON=function () {
  var user = this;
  return _.pick(user,['_id','email']);
}

UserSchema.methods.genarateAuthToken = function () {
  var user = this;
  var access = "auth";
  var token = jwt.sign({_id:user._id,access},"abc123").toString();
  user.tokens.push({
    access,
    token
  });
  return user.save().then(() => {
    return token;
  })
};

UserSchema.methods.removeToken = function(token) {
  var user = this;
  return user.update({
    $pull: {
      tokens: {token}
    }
  });
};

UserSchema.pre('save',function(next){
  var user = this;
  if (user.isModified('password')) {
    bcrypt.genSalt(5,(err,salt) => {
      bcrypt.hash(user.password,salt,(err,hash) => {
        user.password=hash;
        next();
      })
    })
  }
  else{
    next();
  }
});

var User = mongoose.model("User", UserSchema);

module.exports = {
  User
};
