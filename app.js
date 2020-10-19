
require('dotenv').config();
require('./db/connection');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./routes');
const path = require('path');
const expressip = require('express-ip');
const checkToken = require('./utils/middlewares').checkToken;

const helmet = require('helmet');
app.use(helmet());

app.use(expressip().getIpInfoMiddleware);

app.disable('x-powered-by');
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use('/auth/', routes.auth);
app.use('/', routes.url);

app.use(checkToken);
app.use('/user/', routes.users);


module.exports = app;
