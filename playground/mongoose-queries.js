const {ObjectID}=require('mongodb')

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '59e8740dce0ca82064f489e5 aa';
//
// if (!ObjectID.isValid(id)) {
//   return console.log("Invalid ID");
// }

// Todo.find({
//   _id:id
// }).then((todos) => {
//   // console.log('Todos: ',todos);
//   if (todos.length<1) {
//       return  console.log("Nothing todo here");
//   }
//    console.log('Todos: ',todos);
// })
//
// Todo.findOne({_id:id}).then((todo) => {
//   if (!todo) {
//       return  console.log("Nothing todo here");
//   }
//    console.log('Todo: ',todo);
// })

// Todo.findById(id).then((todo) => {
//   return todo==null?console.log("Nothing here"):console.log(todo);;
// }).catch((err) => {
//   console.log(err);
// })

var UserId = '59e1d743c83cee13fc6f54cc';

if (!ObjectID.isValid(UserId)) {
  return console.log("Invalid User ID");
};

User.find({_id:UserId}).then((users) => {
  return users.length<1?console.log("Nothing here!"):console.log("User find():", users);
})

User.findOne({_id:UserId}).then((user) => {
    return user==null?console.log("Nothing here!"):console.log("User find one:", user);
})

User.findById(UserId).then((user) => {
  return user==null?console.log("Nothing here!"):console.log("User find by ID:", user);
})
