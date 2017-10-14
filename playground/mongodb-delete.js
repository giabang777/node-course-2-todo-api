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
  // db.collection("Users").deleteMany({name:"Duy Anh"}).then((result) => {
  //   console.log(result.result);
  // });

  // db.collection("Todos").deleteOne({text:"Eat lunch"}).then((result) => {
  //   console.log(result);

  db.collection("Users").findOneAndDelete({_id:new ObjectID("59dee603283ce937d0d7759b")}).then((result) => {
    console.log(result);
  })
  // db.close();
})
