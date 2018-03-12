var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://nicholas:123456@ds261118.mlab.com:61118/visualisation";


 //module.exports = MongoClient; 

exports.findAll = function(err, db) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("visualisation");
        var query = { name: "COLUMBUS" };
        dbo.collection("conversation").find(query).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          res.send(err, result);
          db.close();
        });
    });
};
/*
exports.findall = function(req, res){
    MongoClient.connect("mongodb://nicholas:123456@ds261118.mlab.com:61118/visualisation", function(err, db) {
        if (err) throw err;
        var dbo = db.db("visualisation");
        dbo.collection("conversation").find().toArray(function(err, result) {
          if (err) throw err;
          res.send(result);
          db.close();
        });
      });
};

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving drink: ' + id);
    MongoClient.connect("mongodb://nicholas:123456@ds261118.mlab.com:61118/visualisation", function(err, db) {
        if (err) throw err;
        var dbo = db.db("visualisation");
    db.collection('visualisation', function(err, collection) {
            collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
                    res.send(item);
                });
        });
    });
};

*/


