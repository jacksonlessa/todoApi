var express = require('express'),
    bodyParser = require('body-parser'),
    todo = require('./routes/todo');

var app = express();

//app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
app.use(bodyParser());


app.get('/', function(req, res) {
    res.send(['/todo', '/todo/:id']);
});

app.get('/todo', todo.findAll);
app.get('/todo/:id', todo.findById);
app.post('/todo',todo.addTodo);
app.put('/todo/:id',todo.updateTodo);
app.delete('/todo/:id',todo.deleteTodo);

app.listen(3000);
console.log('Listening on port 3000...');
