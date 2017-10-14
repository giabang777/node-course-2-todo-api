// const MongoClient = require('mongodb').MongoClient;
const {MongoClient,ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

var url = 'mongodb://localhost:27017/TodoApp'

MongoClient.connect(url,(err,db) => {
  if(err){
    return console.log("Cannot connect to database, something was wrong!!");
  }
  console.log("Connected to database!");

  // db.collection('Todos').insertOne({
  //   text:'something to do',
  //   completed: false
  // },(err,result) => {
  //   if (err) {
  //     return console.log("Cannot insert!!");
  //   }
  //   console.log(JSON.stringify(result.ops,undefined,2));
  // });
  // db.collection("Users").insertOne({
  //   name:"Duy Anh",
  //   age:25,
  //   location:"Vietnam"
  // },(err,result) => {
  //   if (err) {
  //     return console.log("Cannot insert!");
  //   }
  //   console.log(JSON.stringify(result.ops,undefined,2));
  //   console.log(result.ops[0]._id.getTimestamp());
  // })
  db.close();
})
