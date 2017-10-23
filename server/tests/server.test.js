const request = require('supertest');
const expect = require('expect');
const {
  ObjectID
} = require('mongodb');

const {
  app
} = require('./../server');
const {
  Todo
} = require('./../models/todo');

const todos = [{
  _id: ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333
}]

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

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
