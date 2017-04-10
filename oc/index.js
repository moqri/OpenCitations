const SparqlClient = require('sparql-client-2');
const SPARQL = SparqlClient.SPARQL;
const endpoint = 'http://opencitations.net/sparql';

var express = require('express')
var router = express.Router();

var query;
var qres;




//HOME
router.get('/', function (req, res) {
  title=req.query.title
  limit=req.query.limit
  console.dir(title)

  var fs = require('fs'),
      xml2js = require('xml2js');
  var parser = new xml2js.Parser();

  var request = require('request');
  query=`
    select distinct ?journal ?title where 
    {
      ?journal <http://purl.org/dc/terms/title> ?title.
      ?journal ?p <http://purl.org/spar/fabio/Journal>
      FILTER regex(?title,'`+title+`','i')
    }
    order by ?title
    limit `+limit;

  url=endpoint+'?query='+encodeURIComponent(query)
  if (typeof(title)=='undefined' || title=='' ){
    console.log('aaaaundefined')
    res.render('oc/index');
  }else{
    request.get(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = body;
      parser.parseString(data, function (err, result) {
        var results=result.sparql.results[0].result;
        console.dir(results)
        res.render('oc/index',{qres:results});
        });
      }
    });
  }
})

//Journal
router.get('/journal', function (req, res) {
  uri=req.query.uri
  limit='100'

  var fs = require('fs'),
      xml2js = require('xml2js');
  var parser = new xml2js.Parser();

  var request = require('request');
  query=`
  PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
  select distinct ?uri ?vol where 
  {
  ?uri ?p <`+uri+`>.
  ?uri <http://purl.org/spar/fabio/hasSequenceIdentifier> ?vol
  }
  order by (xsd:integer(?vol))
  limit `+limit;

  url=endpoint+'?query='+encodeURIComponent(query)
  request.get(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          var data = body;
      parser.parseString(data, function (err, result) {
          var results=result.sparql.results[0].result;
          console.dir(results)
          res.render('oc/journal',{qres:results});
      });

      }
  });
})

//volume
router.get('/volume', function (req, res) {
  uri=req.query.uri
  limit='100'

  var fs = require('fs'),
      xml2js = require('xml2js');
  var parser = new xml2js.Parser();

  var request = require('request');
  query=`
  PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
  select distinct ?uri ?iss where 
  {
  ?uri ?p <`+uri+`>.
  ?uri <http://purl.org/spar/fabio/hasSequenceIdentifier> ?iss
  }
  order by (xsd:integer(?iss))
  limit `+limit;

  url=endpoint+'?query='+encodeURIComponent(query)
  request.get(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          var data = body;
      parser.parseString(data, function (err, result) {
          var results=result.sparql.results[0].result;
          console.dir(results)
          res.render('oc/volume',{qres:results});
      });

      }
  });
})

//issue
router.get('/issue', function (req, res) {
  uri=req.query.uri
  limit='100'

  var fs = require('fs'),
      xml2js = require('xml2js');
  var parser = new xml2js.Parser();

  var request = require('request');
  query=`
select distinct ?uri ?article 
{
?uri ?p <`+uri+`>.
?uri <http://purl.org/dc/terms/title> ?article

}
order by ?article
limit `+limit;

  url=endpoint+'?query='+query
  request.get(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          var data = body;
      parser.parseString(data, function (err, result) {
          var results=result.sparql.results[0].result;
          console.dir(results)
          res.render('oc/issue',{qres:results});
      });

      }
  });
})

//article
router.get('/article', function (req, res) {
  uri=req.query.uri
  article=req.query.article
  limit='100'

  var fs = require('fs'),
      xml2js = require('xml2js');
  var parser = new xml2js.Parser();

  var request = require('request');
  query=`
select distinct ?uri ?article 
{
?uri ?p <`+uri+`>.
?uri <http://purl.org/dc/terms/title> ?article

}
order by ?article
limit `+limit;

  url=endpoint+'?query='+query
  request.get(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          var data = body;
      parser.parseString(data, function (err, result) {
          var results=result.sparql.results[0].result;
          console.dir(results)
          res.render('oc/article',{qres:results,article:article});
      });

      }
  });
})


router.use("/css",express.static(__dirname + '/css'));



module.exports = router;



