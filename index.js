require('express-async-errors');
const winston = require('winston');
require('winston-mongodb').MongoDB;
const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const app = express();
require('./startup/routes')(app);
require('./startup/db')();

winston.exceptions.handle(
  new winston.transports.File({filename: 'uncaughtExections.log'}));

process.on('unhandledRejection', ex => {
  throw ex;
});

winston.add(new winston.transports.File({ filename: 'logfile.log' }));
winston.add(new winston.transports.MongoDB, {
  db: 'localhost/vidly', 
  level: 'info'
});

const p = Promise.reject(new Error('Something failed'));
p.then(() => console.log('Done'));

if(!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined');
  process.exit(1);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));