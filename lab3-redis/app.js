//Almost the entirety of this submission is based on my old Lab 8 code from CS546.
const express = require('express');
const app = express();

const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

const redis = require('redis');

const bluebird = require('bluebird');
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const static = express.static(__dirname + '/public');
app.use('/public', static);

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});