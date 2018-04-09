// Update with your config settings.
const path = require('path');
const BASE_PATH = path.join(__dirname, '/database/test');

console.log('__dirname ', __dirname);

module.exports = {
  production: {
    client: 'pg',
    connection: {
      host: '172.31.6.202',
      port     : '5432',
      user     : 'involtp',
      password : 'abc123',
      database : 'invdb',
      charset  : 'utf8'
    }, 
    pool: {
      "min": 2,
      "max": 40
    }
  },
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
      "max": 40
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


