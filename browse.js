const SparqlClient = require('sparql-client-2');
const SPARQL = SparqlClient.SPARQL;
const endpoint = 'http://opencitations.net/sparql';
var express = require('express')
var app = express()
app.set('view engine', 'pug')
var query;
var qres;




//HOME
app.get('/', function (req, res) {
  title=req.query.title
  console.dir(title)

  var fs = require('fs'),
      xml2js = require('xml2js');
  var parser = new xml2js.Parser();

  var request = require('request');
  query=`
select ?journal ?title where 
{
  ?journal <http://purl.org/dc/terms/title> ?title.
  ?journal ?p <http://purl.org/spar/fabio/Journal>
  FILTER regex(?title,'`+title+`','i')
}
limit 100
  `;
  url=endpoint+'?query='+query
  request.get(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          var data = body;
      parser.parseString(data, function (err, result) {
          var results=result.sparql.results[0].result;
          console.dir(results)
          res.render('index',{qres:results});
      });

      }
  });
})

//Journal
app.get('/journal', function (req, res) {
  uri=req.query.uri

  var fs = require('fs'),
      xml2js = require('xml2js');
  var parser = new xml2js.Parser();

  var request = require('request');
  query=`
select * where 
{
?s ?p <`+uri+`>
}
limit 100
  `;
  url=endpoint+'?query='+query
  request.get(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          var data = body;
      parser.parseString(data, function (err, result) {
          var results=result.sparql.results[0].result;
          console.dir(results)
          res.render('journal',{qres:results});
      });

      }
  });
})

//volume
app.get('/volume', function (req, res) {
  uri=req.query.uri

  var fs = require('fs'),
      xml2js = require('xml2js');
  var parser = new xml2js.Parser();

  var request = require('request');
  query=`
select * where 
{
?s ?p <`+uri+`>
}
limit 100
  `;
  url=endpoint+'?query='+query
  request.get(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          var data = body;
      parser.parseString(data, function (err, result) {
          var results=result.sparql.results[0].result;
          console.dir(results)
          res.render('volume',{qres:results});
      });

      }
  });
})

//number
app.get('/number', function (req, res) {
  uri=req.query.uri

  var fs = require('fs'),
      xml2js = require('xml2js');
  var parser = new xml2js.Parser();

  var request = require('request');
  query=`
select ?title 
{
?s ?p <`+uri+`>.
?s <http://purl.org/spar/c4o/hasContent> ?title

}
limit 100
  `;
  url=endpoint+'?query='+query
  request.get(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          var data = body;
      parser.parseString(data, function (err, result) {
          var results=result.sparql.results[0].result;
          console.dir(results)
          res.render('number',{qres:results});
      });

      }
  });
})

//YEAR_ARTICLES
app.get('/year_articles', function (req, res) {
  var source = req.query.source;
  var year = req.query.year;
  query =SPARQL`
  SELECT distinct ?title ?creator
  WHERE {
   ?s <ex:date> "`+year+`".
   ?s <ex:source> "`+source+`".
   ?s <ex:title> ?title.
   ?s <ex:creator> ?creator.
 }
 order by (?title)
 LIMIT 500`;

 client.query(query)
 .execute({format: {resource: 'title'}})
 .then(function (results) {
  qres=results['results']['bindings'], {depth: null};
  console.dir(qres);
  res.render('year_articles',{"qres":qres,"source":source,"year":year})}).catch(function (error) {console.dir(error);});  
})

//Search
app.get('/search', function (req, res) {
  if (req.query.input){
    var input = req.query.input.toLowerCase();
    var select=req.query.select
    if (select=="title"){
      query =SPARQL`
      SELECT distinct ?title ?source ?year ?creator
      WHERE {
       ?s <ex:title> ?title.
       ?s <ex:source> ?source.
       ?s <ex:creator> ?creator.
       ?s <ex:date> ?year.
       filter contains(lcase(?title),"`+input+`")  
     }
     order by desc(?year)
     LIMIT 100`;

     client.query(query)
     .execute({format: {resource: 'title'}})
     .then(function (results) {
      qres=results['results']['bindings'], {depth: null};
      console.dir(qres);
      res.render('search',{"qres":qres,"input":input,"input_select":select})}).catch(function (error) {console.dir(error);
      });
    }
    if (select=="author"){
      query =SPARQL`
      SELECT distinct ?title ?source ?year ?creator
      WHERE {
       ?s <ex:title> ?title.
       ?s <ex:source> ?source.
       ?s <ex:creator> ?creator.
       optional {?s <ex:date> ?year.}
       filter contains(lcase(?creator),"`+input+`")  
     }
     order by desc(?year)
     LIMIT 100`;

     client.query(query)
     .execute({format: {resource: 'title'}})
     .then(function (results) {
      qres=results['results']['bindings'], {depth: null};
      console.dir(qres);
      res.render('search',{"qres":qres,"input":input,"input_select":select})}).catch(function (error) {console.dir(error);
      });
    }
  } else {
    res.render('search',{"qres":""})
  }
})

//Article
app.get('/article', function (req, res) {
  var source = req.query.source;
  var year = req.query.year;
  var title = req.query.title.replace(/\"/g,'\\"')
  query =SPARQL`
  SELECT distinct ?title ?source ?year ?creator ?abstract ?keyword ?url
  WHERE {
   ?s <ex:title> ?title.
   ?s <ex:title> "`+title+`".
   ?s <ex:source> ?source.
   ?s <ex:creator> ?creator.
   optional{?s <ex:date> ?year.}
   optional{?s <ex:abstract> ?abstract.}
   optional{?s <ex:url> ?url.}
   optional{?s <ex:keyword> ?keyword.}
  }
  order by desc(?year)
 LIMIT 100`;
 console.dir(query);
 client.query(query)
 .execute({format: {resource: 'title'}})//
 .then(function (results) {
  qres=results['results']['bindings'], {depth: null};
  console.dir(qres);

  res.render('article',{"qres":qres,"source":source,"year":year,"title":title})}).catch(function (error) {console.dir(error);
});  
})

//Author
app.get('/author', function (req, res) {
  var name = req.query.name
  query =SPARQL`
  SELECT ?title ?source ?year ?creator ?abstract ?keyword ?url
  WHERE {
   ?s <ex:title> ?title.
   ?s <ex:source> ?source.
   ?s <ex:creator> ?creator.
   ?s <ex:date> ?year.
   ?s <ex:creator> "`+name+`".
  }
 order by desc(?year)
 LIMIT 500`;
 console.dir(query);
 client.query(query)
 .execute({format: {resource: 'title'}})//
 .then(function (results) {
  qres=results['results']['bindings'], {depth: null};
  console.dir(qres);

  res.render('author',{"qres":qres,"name":name})}).catch(function (error) {console.dir(error);
});  
})

//Keyword
app.get('/keyword', function (req, res) {
  var keyword = req.query.keyword
  query =SPARQL`
  SELECT ?title ?source ?year ?creator ?abstract ?keyword ?url
  WHERE {
   ?s <ex:title> ?title.
   ?s <ex:source> ?source.
   ?s <ex:creator> ?creator.
   ?s <ex:date> ?year.
   ?s <ex:keyword> ?keyword.
   ?s <ex:keyword> "`+keyword+`"
  }
 order by desc(?year)
 LIMIT 500`;
 console.dir(query);
 client.query(query)
 .execute({format: {resource: 'title'}})//
 .then(function (results) {
  qres=results['results']['bindings'], {depth: null};
  console.dir(qres);

  res.render('keyword',{"qres":qres,"keyword":keyword})}).catch(function (error) {console.dir(error);
});  
})

app.use("/css",express.static(__dirname + '/css'));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})



