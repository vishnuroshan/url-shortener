
require('dotenv').config();
require('./db/connection');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./routes');
const path = require('path');

app.disable('x-powered-by');
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use('/', routes.url);

module.exports = app;
