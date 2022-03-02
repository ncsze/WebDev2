const express = require('express');
const app = express();
const session = require('express-session');
const configRoutes = require('./routes');

app.use(express.json());

app.use(session({
    name: 'AuthCookie',
    secret: 'shhh, its a secret!',
    resave: false,
    saveUninitialized: true
}));

configRoutes(app);
app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});