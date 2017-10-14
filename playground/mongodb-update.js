// const MongoClient = require('mongodb').MongoClient;
const {
  MongoClient,
  ObjectID
} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

var url = 'mongodb://localhost:27017/TodoApp'

MongoClient.connect(url, (err, db) => {
  if (err) {
    return console.log("Cannot connect to database, something was wrong!!");
  }
  console.log("Connected to database!");
  // db.collection("Todos").findOneAndUpdate({
  //   _id: new ObjectID("59e173ffcdfaac39b1109329")
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log(result);
  // });
  db.collection("Users").findOneAndUpdate({
    _id: new ObjectID("59dee5fcd61769261847a6da")
  }, {
    $set: {
      name: "Duy Anh"
    },
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  });
  // db.close();
})
