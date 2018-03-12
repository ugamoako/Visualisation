var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://nicholas:123456@ds261118.mlab.com:61118/visualisation";

var router = express.Router();

/* GET users listing. */
router.get('/:group', function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("visualisation");
    var query = {group: req.params.group};
    dbo.collection("conversation").find(query).limit(100).toArray(function(err, result) {
      if (err) throw err;
      //console.log(result);
      res.send(result);
      db.close();
    });
  });
  
});

router.get('/getOne/:name', function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    //console.log('params:', req.params.name);
    var dbo = db.db("visualisation");
    var query = {name: req.params.name };
    //console.log('query', query);
    dbo.collection("conversation").find(query).toArray(function(err, result) {
      if (err) throw err;
      //console.log(result);
      res.send(result);
      db.close();
    });
});
  //res.send('send data');
});

module.exports = router;
