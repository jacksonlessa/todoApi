var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect:true});
db = new Db('tododb',server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'tododb' database");
        db.collection('todos', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'todos' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.findAll = function(req, res) {
    db.collection('todos', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving todo: ' + id);
    var col = db.collection('todos')

    col.findOne({'_id':new mongo.ObjectID(id)}, function(err, item) {
        res.send(item);
    });

};

exports.addTodo = function(req, res) {
    var todo = req.body;
    console.log('Adding todo: ' + JSON.stringify(todo));
    db.collection('todos', function(err, collection) {
        collection.insert(todo, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updateTodo = function(req, res) {
    var id = req.params.id;
    var todo = req.body;
    console.log('Updating todo: ' + id);
    console.log(JSON.stringify(todo));
    var col = db.collection('todos');

    col.update({'_id':new mongo.ObjectID(id)}, todo, {safe:true}, function(err, result) {
        if (err) {
            console.log('Error updating todo: ' + err);
            res.send({'error':'An error has occurred'});
        } else {
            console.log('' + result + ' document(s) updated');
            res.send(todo);
        }
    });
}

exports.deleteTodo = function(req, res) {
    var id = req.params.id;
    console.log('Deleting todo: ' + id);
    var col = db.collection('todos')

    col.remove({'_id':new mongo.ObjectID(id)}, {safe:true}, function(err, result) {
        if (err) {
            res.send({'error':'An error has occurred - ' + err});
        } else {
            console.log('' + result + ' document(s) deleted');
            res.send(req.body);
        }
    });

}


var populateDB = function() {
    var todo = [
    {
        title: "Task #1",
        duedate: "2016-07-29",
        complete: false
    },
    {
        title: "Task #1",
        duedate: "2016-07-29",
        complete: false
    }];

    db.collection('todos', function(err, collection) {
        collection.insert(todo, {safe:true}, function(err, result) {});
    });
}
