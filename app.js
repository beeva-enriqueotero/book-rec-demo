var express = require( 'express' );
var http = require( 'http' );
var path  = require( 'path' );
var scraperjs = require('scraperjs');

var app    = express();

var db = require("mongojs").connect('mongodb://localhost/books', ['books']);

// all environments
app.set( 'port', process.env.PORT || 8080 );
app.get(  '/cover', function ( req, res, next ){
  var query = encodeURIComponent(req.query['query']).replace('%20','+');
  var url = 'http://bigbooksearch.com/query.php?SearchIndex=books&Keywords=' + query + '&ItemPage=1';
  scraperjs.StaticScraper.create(url)
    .scrape(function($) {
        return $("img").map(function() {
            return {src:$(this).attr('src'), title:$(this).attr('alt')};
        }).get();
    }, function(books) {
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(books));
    })
});

app.get(  '/search', function ( req, res, next ){
  var query = encodeURIComponent(req.query['query']).replace(/%20/g,' ');
  db.books.find({t: {$regex:query.toUpperCase()}}, function(err, docs) {
    if( err || !docs) {
      console.log("No female users found");
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify([]));
    }
    else{
      var arr = []
      docs.forEach(function(item) { arr.push({"id": item.i, "t" : item.t }); });
      var result = {books:arr.slice(0, 50)};
      res.setHeader('Content-Type', 'application/json');
	message = req.query.callback + "(" + JSON.stringify(result) + ");";
	return res.end(message);
    }
  });
});



http.createServer( app ).listen( app.get( 'port' ), function (){
  console.log( 'Express server listening on port ' + app.get( 'port' ));
});