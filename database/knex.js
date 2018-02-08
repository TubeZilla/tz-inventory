const environment = process.env.NODE_ENV || 'development';
// const config = require('../../../knexfile.js')[environment];
// module.exports = require('knex')(config);
const path = require('path');
const BASE_PATH = path.join(__dirname, '../database');

var config = {
  development: {  
    client: 'pg',
    connection: {
      host     : 'localhost',
      port     : '5432',
      user     : 'involtp',
      password : 'abc123',
      database : 'invdb',
      charset  : 'utf8'
    }, //process.env.PG_CONNECTION_STRING
    pool: {
      "min": 2,
      "max": 20
    }
  },
  test: {
    client: 'pg',
    connection: {
      host     : 'localhost',
      port     : '5432',
      user     : 'involtp',
      password : 'abc123',
      database : 'invdbtest',
      charset  : 'utf8'
    },
    migrations: {
      directory: path.join(BASE_PATH, 'migrations')
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds')
    }
  }
};

var knex = require('knex')(config[environment]);

module.exports = 
{
  knex: knex
};