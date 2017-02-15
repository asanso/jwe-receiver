var express = require("express");
var jose = require('node-jose');
var nosql = require('nosql').load('database.nosql');
var app = express();
app.set('port', (process.env.PORT || 5000));

var resource = {
	"helloWorld" : ""
};

var vectors = [
    {
      desc: "ECDH-ES+A128KW + A128CBC-HS256",
      jwk: {
        "kty": "EC",
        "kid": "3f7b122d-e9d2-4ff7-bdeb-a1487063d799",
        "crv": "P-256",
        "x": "weNJy2HscCSM6AEDTDg04biOvhFhyyWvOHQfeF_PxMQ",
        "y": "e8lnCO-AlStT-NJVX-crhB7QRYhiix03illJOVAOyck",
        "d": "VEmDZpDXXK8p8N0Cndsxs924q6nS1RXFASRl6BfUqdw"
      },
      alg: "ECDH-ES+A128KW",
      enc: "A128CBC-HS256",
      plaintext: new Buffer("Gambling is illegal at Bushwood sir, and I never slice.", "utf8")
    }
];

app.get("/", function(req, res){

  var promise,
          key;
      promise = JWK.asKey(v.jwk);
      promise = promise.then(function(jwk) {
        key = jwk;
        var cfg = {
          contentAlg: v.enc
        };
        var recipient = {
          key: key,
          header: {
            alg: v.alg
          }
        };
        var jwe = JWE.createEncrypt(cfg, recipient);
        return jwe.update(v.plaintext).final();
      });
      promise = promise.then(function(result) {

        var jwe1 = {};
        jwe1.protected  = "eyJhbGciOiJFQ0RILUVTK0ExMjhLVyIsImVuYyI6IkExMjhDQkMtSFMyNTYiLCJlcGsiOnsia3R5IjoiRUMiLCJ4IjoiZ1RsaTY1ZVRRN3otQmgxNDdmZjhLM203azJVaURpRzJMcFlrV0FhRkpDYyIsInkiOiJjTEFuakthNGJ6akQ3REpWUHdhOUVQclJ6TUc3ck9OZ3NpVUQta2YzMEZzIiwiY3J2IjoiUC0yNTYifX0";
        jwe1.encrypted_key = "qGAdxtEnrV_3zbIxU2ZKrMWcejNltjA_dtefBFnRh9A2z9cNIqYRWg";
        jwe1.iv = "pEA5kX304PMCOmFSKX_cEg";
        jwe1.ciphertext = "a9fwUrx2JXi1OnWEMOmZhXd94-bEGCH9xxRwqcGuG2AMo-AwHoljdsH5C_kcTqlXS5p51OB1tvgQcMwB5rpTxg";
        jwe1.tag = "72CHiYFecyDvuUa43KKT6w";
 
        assert.ok(result);
        var jwe = JWE.createDecrypt(key);
        return jwe.decrypt(jwe1);
      });
      promise = promise.then(function(result) {
        assert.deepEqual(result.plaintext, v.plaintext);
      });

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
