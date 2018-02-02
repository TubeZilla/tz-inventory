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
//272565 
const selectChannels = (callback) => {
  knex.from('channels').select('channel_id', 'publisher_id').whereBetween('id', [272565 , 1169450])
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

const createVideos = (params, callback) => {
  // var chunkSize = 1000;
  console.log('params.length ', params.length);
  // knex.transaction(function(tr) {
  //   return knex.batchInsert('videos', params)
  //     .transacting(tr)
  //   })
  //   .then(function(ids) { 
  //     console.log('transaction completed');
  //     callback(null, ids.length);
  //   })
  //   .catch(function(error) { 
  //     console.log('error in transaction');
  //     callback(error);
  //   });
  knex.batchInsert('videos', params)
    .returning('id')
    .then(function(ids) { 
       console.log(ids);
       callback(null, ids.length);
     })
    .catch(function(error) {
      console.log(error); 
      callback(error);
    });
};

module.exports = {
  createUser: createUser,
  createVideo: createVideo,
  selectUsers: selectUsers,
  createChannels: createChannels,
  selectChannels: selectChannels,
  createVideos: createVideos
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