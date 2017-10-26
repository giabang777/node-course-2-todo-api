const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!'

bcrypt.genSalt(10,(err,salt) => {
  bcrypt.hash(password,salt,(err,hash) => {
    console.log(hash);
  });
});
var hashpass = '$2a$10$KBhbIht.D2OUhn9mNGZqQuKF3lnS7tG6MGtjj4i4Hz9lhq5Rhqf/.';
bcrypt.compare('123abc!',hashpass,(err,result) => {
  console.log(result);
})

// var data ={
//   id:10
// }
// var token = jwt.sign(data,'123abc');
// console.log(token);
//
// var decoded = jwt.verify(token+"2",'123abc');
// console.log(decoded);
