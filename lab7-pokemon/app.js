const express = require('express');
const app = express();

const cors = require('cors');

const configRoutes = require('./routes');

const redis = require('redis');

const bluebird = require('bluebird');
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());  

configRoutes(app);

app.listen(5000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:5000');
  });