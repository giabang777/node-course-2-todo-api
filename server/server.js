require('./config/config');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID}=require('mongodb')
const bcrypt = require('bcryptjs');


var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

//#region /todos route APIs
app.post('/todos',authenticate,(req,res) => {
  // console.log(req.body);
  var todo = new Todo({
    text:req.body.text,
    _creator:req.user._id
  });
  todo.save().then((doc) => {
    res.send(doc);
  },(err) => {
    res.status(400).send(err);
  })
});

app.get('/todos',authenticate,(req,res) => {
  Todo.find({_creator:req.user._id}).then((todos) => {
    res.send({
      todos
    })
  },(err) => {
    res.status(400).send(err);
  });
});

app.get('/todos/:id',authenticate,(req,res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findOne({_id:id,_creator:req.user._id}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.status(200).send({todo});
  }).catch((e) => {
    res.status(400).send();
  })
});

app.delete('/todos/:id',authenticate,(req,res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findOneAndRemove({_id:id,_creator:req.user._id}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.status(200).send({todo});
  }).catch((err) => {
    res.status(400).send();
  })
})

app.patch('/todos/:id',authenticate,(req,res) => {
  var id = req.params.id;
  var body = _.pick(req.body,['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  }
  else{
    body.completed = false;
    body.completedAt = null;
  }
  Todo.findOneAndUpdate({_id:id,_creator:req.user._id},{$set:body},{new:true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((err) => {
    res.status(400).send();
  })
})
//#endregion

//#region /users route APIs
app.post('/users',(req,res) => {
  body = _.pick(req.body, ['email','password'])
  var user = new User(body);
  user.save().then(() => {
    // console.log(doc.toCustomJSON());
    return user.genarateAuthToken();
  }).then((token) => {
    res.header('x-auth',token).send(user.toCustomJSON());
  }).catch((e) => {
    res.status(400).send(e);
  })
});

app.get('/users/profile', authenticate, (req,res) => {
  res.send(req.user.toCustomJSON());
});

app.post('/users/login',(req,res) => {
  var body = _.pick(req.body,['email','password']);
  User.findByCredentials(body.email,body.password).then((user) => {
    // res.send(user.toCustomJSON());
    return user.genarateAuthToken().then((token) => {
      res.header('x-auth',token).send(user.toCustomJSON());
    })
  }).catch((err) => {
    res.status(400).send({err});
  })
});

app.delete('/users/profile/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send()
  }, (err) => {
    res.status(400).send(err);
  });
});
//#endregion

app.listen(port,() => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
