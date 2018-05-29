const express = require('express');
const routes = require('./routes/api/transactions');

const app = express();

//use the express midellware
app.use(express.json());

//all routes
app.use('/', routes);

const port = process.env.POST || 3000;
app.listen(port, () => { console.log("Example app that listening on port 3000")});