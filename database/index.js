const schema = require('./schema.js');
var knex = require('./knex.js').knex;
var Promise = require('bluebird');

//params is an array of json objects that will be need to be mapped
//to each users record column
const createUser = (params, callback) => {
  knex.insert(params).into('users')
  .then((id) => {
    console.log(id);
    callback(null, id);
  });
};

//params is an array of json that has already been mapped
//to videos record column
const createVideo = (params, start, end, callback) => {
  let inserts = [];
  for (var i = start; i < end; i++) {
    inserts.push(params[i]);
  }
  knex.insert(inserts).into('videos')
  .then((id) => {
    callback(null, id);
  });
};

const selectUsers = (callback) => {
  knex.from('users').select('userid').whereBetween('id', [555200, 610000])
  .then((records) => {
    callback(records);
  });
};

const createChannels = (params, callback) => {
  knex.insert(params).into('channels')
  .then((id) => {
    console.log(id);
    callback(null, id);
  });
};

module.exports = {
  createUser: createUser,
  createVideo: createVideo,
  selectUsers: selectUsers,
  createChannels: createChannels
};

// var rows = [{...}, {...}];
// var chunkSize = 1000;
// knex.batchInsert('channels', params, chunkSize)
//   .returning('id')
//   .then(function(ids) { 
//      callback(null, ids.length);
//    })
//   .catch(function(error) { 
//     callback(error);
//   });
// var rows = [{...}, {...}];
// var chunkSize = 30;
// knex.batchInsert('TableName', rows, chunkSize)
//   .returning('id')
//   .then(function(ids) { ... })
//   .catch(function(error) { ... });

// knex.transaction(function(tr) {
//   return knex.batchInsert('TableName', rows, chunkSize)
//     .transacting(tr)
//   })
//   .then(function() { ... })
//   .catch(function(error) { ... });