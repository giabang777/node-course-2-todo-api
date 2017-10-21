const {ObjectID}=require('mongodb')

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//   console.log(result);
// });

// Todo.findOneAndRemove({text:})

Todo.findByIdAndRemove('59eb060a10bc472a2f44bd8c').then((doc) => {
  console.log(doc);
})
