const jwt = require('jsonwebtoken');

var data ={
  id:10
}
var token = jwt.sign(data,'123abc');
console.log(token);

var decoded = jwt.verify(token+"2",'123abc');
console.log(decoded);
