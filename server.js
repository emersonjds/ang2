var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/demo');
var db = mongoose.connection;
var Schema = mongoose.Schema;

var kittySchema = mongoose.Schema({
    name: String
});
var Kitten = mongoose.model('Kitten', kittySchema);

var brotherSchema = mongoose.Schema({
    name: String,
    kitten: {
        type: Schema.Types.ObjectId,
        ref: 'Kitten'
    }
});
var Brother = mongoose.model('Brother', brotherSchema);

app.post('/callback', function(req, res) {

    var obj = new Kitten({ name: 'Silence' });
    var obj2 = new Brother({ name: 'Irmao' });

    obj.save(function(err, obj) {
        if (err)
            return console.error(err);

        obj2.kitten = obj._id;

        obj2.save(function(err, obj2) {
            if (err)
                return console.error(err);

            res.send(obj2);
        })

    });
});

app.post('/promise', function(req, res) {

    var obj = new Kitten({ name: 'Silence' });
    var obj2 = new Brother({ name: 'Irmao' });


    save(obj)
        .then((result) => {
            obj2.kitten = result._id;
            return save(obj2);
        })
        .then((result2) => {
            res.send(result2);
        })
        .catch((err) => {
            res.send(err);

        })

});

function save(obj) {
    return new Promise((resolve, reject) => {

        obj.save(function(err, obj) {
            if (err)
                reject(err)

            resolve(obj);

        });

    })

}

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    app.listen(3000, function(err) {
        console.log('Example app listening on port 3000!');
    });
});

console.log('teste');