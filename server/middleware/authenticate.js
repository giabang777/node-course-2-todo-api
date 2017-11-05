var {User} = require('./../models/user');

var authenticate = (req,res,next) => {
  var token = req.header('x-auth');

  User.findByToken(token).then((user) => {
    if (!user) {
      return Promise.reject("[mdw] Please login!");
    }
    // req.user = user.toCustomJSON();
    req.user = user;
    req.token = token;
    next();
  }).catch((err) => {
    // console.log(e);
    res.status(401).send({err});
  });
}

module.exports = {authenticate};
