var express = require('express')

var app = express()
app.set('view engine', 'pug')

app
  .use('/oc', require('./oc/index'))
  .listen(3000);
