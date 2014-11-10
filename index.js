var express = require('express');
var MongoClient = require('mongodb').MongoClient;

var app = express();
app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'));

// Connection URL
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
	console.log("Connected correctly to server");
	removeDocument(db, function(){
	  	insertDocuments(db, function() {
	  		findDocuments(db, function(){
	  			db.close();
	  		})
	  	})
	});
});

var places = [{}]

app.get("/places", function(request,response){
	console.log("replying with places array");
	response.send(places);
});

var insertDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.insert([
    {a : 1}, {a : 2}, {a : 3}, {a : 6}
  ], function(err, result) {
    console.log("Inserted 3 documents into the document collection");
    callback(result);
  });
};

var findDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    console.log("Found the following records");
    console.dir(docs)
    callback(docs);
  });      
}

var removeDocument = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.remove({ a : {'$lt': 10} }, function(err, result) {
    console.log("Removed the document with the field a equal to 3");
    callback(result);
  });    
}

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})