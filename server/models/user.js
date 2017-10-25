const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

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

var User = mongoose.model("User", UserSchema);

module.exports = {
  User
};
