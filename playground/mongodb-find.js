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

  // db.collection("Todos").find({completed:false}).toArray().then((docs) => {
  //   console.log(JSON.stringify(docs,undefined,2));
  // },(err) => {
  //   console.log("Unable to fetch Todos! ", err);
  // });
  db.collection("Users").find({name:"Thanh Thảo"}).toArray().then((docs) => {
    console.log(JSON.stringify(docs,undefined,2));
  },(err) => {
    if (err) {
      console.log("Unable to find!",err);
    }
  });
  db.collection("Users").find().forEach((doc) => {
    if (doc.name!=="Mỹ Viện") {
      console.log(JSON.stringify(doc,undefined,2));
    }
  })
  // db.close();
})
