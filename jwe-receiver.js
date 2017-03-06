var express = require("express");
var bodyParser = require('body-parser');
var jose = require('node-jose');
var nosql = require('nosql').load('database.nosql');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var JWE = jose.JWE;
var JWK = jose.JWK;

var v = 
    {
      desc: "ECDH-ES+A128KW + A128CBC-HS256",
      jwk: {
        "kty": "EC",
        "kid": "3f7b122d-e9d2-4ff7-bdeb-a1487063d799",
        "crv": "P-256",
        "x": "-FGbqex64RJzQkRfkLuimKkSdYNX7hbAnPjN28U_UWw",
        "y": "kPtFbM338rpGoQ_QiinJ4Tojr_0kl7oF_TCoZxSvyMQ",
        "d": "A_8M"
      },
      alg: "ECDH-ES+A128KW",
      enc: "A128CBC-HS256",
      plaintext: new Buffer("Gambling is illegal at Bushwood sir, and I never slice.", "utf8")
    };

app.get("/", function(req, res){
  res.status(200);
  res.send("<h2>Hi there! Just POST your secret to https://obscure-everglades-31759.herokuapp.com/secret</h2>");
});

app.post("/secret", function(req, res){
  
  if (req.body.token) { 
    jose.JWK.asKey(v.jwk).then(function (key) {
      var jwe = JWE.createDecrypt(key);
      return jwe.decrypt(req.body.token);
    }).then(function () {
      res.status(200);
      res.send();
    }).catch(function (e) {
      console.log(e);
      res.status(400);
      res.send();
    });
  } else {
    res.status(404);
    res.send({ error: 'Not found' });
  }

});


app.get("/ecdh-es-public.json", function(req, res){
  var jwk = {
        kty: "EC",
        kid: "3f7b122d-e9d2-4ff7-bdeb-a1487063d799",
        crv: "P-256",
        x: "-FGbqex64RJzQkRfkLuimKkSdYNX7hbAnPjN28U_UWw",
        y: "kPtFbM338rpGoQ_QiinJ4Tojr_0kl7oF_TCoZxSvyMQ"
      };

  res.json(jwk);
});

var server = app.listen(app.get('port'), function() {
  var host = server.address().address;
  var port = port;
});
