var developmentConfig = {
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
};

var knex = require('knex')(developmentConfig);
// var bookshelf = require('bookshelf')(knex);

module.exports = 
{
  knex: knex
};