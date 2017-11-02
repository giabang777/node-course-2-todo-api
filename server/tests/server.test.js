const request = require('supertest');
const expect = require('expect');
const {
  ObjectID
} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos,populateTodos,users,populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('Should create a new todo', (done) => {
    var text = 'Test todo text';
    request(app)
      .post('/todos')
      .send({
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({
          text
        }).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done()
        }).catch((e) => {
          done(e);
        })
      });
  });
  it('Should not create todo with bad request', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({}).then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => {
          done(e)
        })
      })
  })
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  })
});

describe('GET /todos/:id', () => {
  it('Should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toString()}`)
      .expect(200)
      .expect((res) => {
        // console.log(res.body.todo);
        // expect(res.body.todo).toBeFalsy();
        expect(res.body.todo).toBeTruthy();
        expect(res.body.todo.text).toBe('First test todo');
      })
      .end(done);
  });

  it('Should return a 404 if todo not found', (done) => {
    request(app)
      .get(`/todos/${ObjectID().toString()}`)
      .expect(404)
      .end(done);
  });

  it('Should return a 404 for non-object ids', (done) => {
    request(app)
      .get(`/todos/123`)
      .expect(404)
      .end(done);
  })

})

describe('DELETE /todos/:id', () => {
  var hexId = todos[0]._id.toHexString();
  it('Should remove a todo', (done) => {
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          // expect(todo).toBe(null);
          expect(todo).toBeFalsy();
          // expect(todo).toBeTruthy();
          done();
        }).catch((err) => {
          return done(err);
        });
      });
  });

  it('Should return 404 if todo not found', (done) => {
    request(app)
      .delete(`/todos/${ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('Should return 404 if object id is invalid', (done) => {
    request(app)
      .delete(`/todos/123`)
      .expect(404)
      .end(done);
  })
});

describe('PATCH /todos/:id',() => {
  it("Should update a todo!",(done) => {
    var id = todos[0]._id.toHexString();
    var todo = {
      text:'Updated 1st test todo',
      completed:true
    }
    request(app)
    .patch(`/todos/${id}`)
    .send(todo)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todo.text);
      expect(res.body.todo.completed).toBe(todo.completed);
      expect(res.body.todo.completedAt).toEqual(expect.any(Number));
    })
    .end((err,res) => {
      if (err) {
        return done(err);
      }

      Todo.findById(id).then((doc) => {
        expect(doc.text).toBe(todo.text);
        expect(doc.completed).toBe(todo.completed);
        expect(doc.completedAt).toEqual(expect.any(Number));
        done();
      }).catch((err) => {
        return done(err);
      });
    })
  });

  it("Should clear completedAt when todo.completed false!",(done) => {
    var id = todos[1]._id.toHexString();
    var todo = {
      text:'Updated 2nd test todo',
      completed:false
    }
    request(app)
    .patch(`/todos/${id}`)
    .send(todo)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todo.text);
      expect(res.body.todo.completed).toBe(todo.completed);
      expect(res.body.todo.completedAt).toBeFalsy();
      expect(res.body.todo.completedAt).toEqual(null);
    })
    .end((err,res) => {
      if (err) {
        return done(err);
      }

      Todo.findById(id).then((doc) => {
        expect(doc.text).toBe(todo.text);
        expect(doc.completed).toBe(todo.completed);
        expect(doc.completedAt).toBeFalsy();
        expect(doc.completedAt).toEqual(null);
        done();
      }).catch((err) => {
        return done(err);
      });
    })
  });
})

describe('GET /users/profile',() => {
  it('should return user if authenticated',(done) => {
    request(app)
    .get('/users/profile')
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body._id).toBe(users[0]._id.toString());
      expect(res.body.email).toBe(users[0].email);
    })
    .end(done);
  })
  it('should return 401 if not authenticated',(done) => {
    request(app)
    .get('/users/profile')
    // .set('x-auth',users[1],tokens[0].token)
    .expect(401)
    .expect((res) => {
      expect(res.body.e).toEqual(expect.any(String));
      // expect(res.body).toEqual({});
    })
    .end(done);
  })
})

describe('POST /users',() => {
  it('Should create a user',(done) => {
    var email = "vidu@example.com";
    var password = "123mnb!"
    request(app)
    .post('/users')
    .send({email,password})
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toEqual(expect.anything());
      expect(res.body._id).toEqual(expect.any(String));
      expect(res.body.email).toBe(email);
    })
    .end((err) => {
      if (err) {
        return done(err);
      }
      User.findOne({email}).then((user) => {
        // console.log(user);
        expect(user).toEqual(expect.any(Object));
        expect(user.password).not.toBe(password);
      }).catch((err) => done(err));
      done();
    });
  });

  it('Should return validation erros if request invalid',(done) => {
    var email = "vidu.com";
    var password = "1!"
    request(app)
    .post('/users')
    .send({email,password})
    .expect(400)
    .end(done);
  });

  it('Should not create a user if email in use',(done) => {
    var email = users[0].email;
    var password = "123mnb!"
    request(app)
    .post('/users')
    .send({email,password})
    .expect(400)
    .end(done);
  });
})

describe('POST /users/login',() => {
  it('Should return token when login (User does not log in yet, so cho users[1])',(done) => {
    request(app)
    .post('/users/login')
    .send({"email":users[1].email,"password":users[1].password})
    .expect(200)
    .expect((res) => {
      // console.log(res.header['x-auth']);
      expect(res.header['x-auth']).toEqual(expect.anything());
      expect(res.body._id).toEqual(expect.any(String));
      expect(res.body.email).toBe(users[1].email);
    })
    .end((err,res) => {
      if (err) {
        return done(err)
      };
      User.findById(users[1]._id).then((user) => {
        // console.log(user.tokens[0].token);
        // console.log(res.header['x-auth']);
        expect(user.tokens[0].toObject()).toHaveProperty("access","auth");
        expect(user.tokens[0].toObject()).toHaveProperty('token',res.header['x-auth']);
        done();
      }).catch((err) => done(err));
    });
  });
  it('Should return 400 when email or password not match',(done) => {
    var email = "duyanh@gmail.com";
    var password = "duanh@@";
    request(app)
    .post('/users/login')
    .send({email,password})
    .expect(400)
    .expect((res) => {
      expect(res.header['x-auth']).not.toEqual(expect.anything());
      expect(res.body.err).toEqual(expect.any(String));
    })
    .end((err,res) => {
      if (err) {
        return done(err);
      }
      User.findById(users[1]._id).then((user) => {
        expect(user.tokens.length).toBe(0)
        done();
      }).catch((err) => done(err));
    });
  });
})
