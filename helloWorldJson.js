var express = require("express");
var nosql = require('nosql').load('database.nosql');
var app = express();
app.set('port', (process.env.PORT || 5000));

var resource = {
	"helloWorld" : ""
};

app.get("/", function(req, res){

  if (req.query.name) {	
    nosql.insert(req.query.name);
      res.writeHead(302,
     {Location: '/'}
    );
    res.end();
  } else if (req.query.surname) {
  	 resource.helloWorld = req.query.surname;
	   res.json(resource);
  } else if (req.query.title) {
  	 res.send('{"helloWorld": "'+req.query.title+'"}');
  } else {
    nosql.one(function(name) {
        return name; ;
      },function(err, name) {
    if (name) {      
      nosql.clear();
      res.send('{"helloWorld": "'+name+'"}');
      return;
    } else {       
      res.send('{"helloWorld"}');
      return;
    }});
  }
});


var server = app.listen(app.get('port'), function() {
  var host = server.address().address;
  var port = port;
});
