const schema = require('./schema.js');
var knex = require('./knex.js').knex;
var Promise = require('bluebird');
var copyFrom = require('pg-copy-streams').from;

const writeFileToPostgres = (dataFile) => {
  knex.client.pool.acquire(function(err, client){
    function done (err) {
      connection.client.pool.release(client)
      if (err) console.log(err)
      else console.log('success')
    }
    var stream = client.query(copyFrom('COPY channels_subscribers FROM STDIN'))
    var fileStream = fs.createReadStream(dataFile);
    fileStream.on('error', done);
    fileStream.pipe(stream).on('finish', done).on('error', done)
  });
};


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

/**
 * Subscribers have been picked from another subset of users
 * that have ids between 610000 and 957886.
 * Publishers have been picked from the range of 
 * [555200, 610000]. This is to avoid equal ids for
 * subscribers and publishers though in reality subscribers
 * can be publishers and publishers can be subscribers to other's
 * channels.
 */
const selectUsers = (callback) => {
  knex.from('users').select('userid').whereBetween('id', [610000, 1506886])//[555200, 610000])
  .then((records) => {
    callback(records);
  });
};
/**
 * starting index: 272565; the rest not selected 
 * */ 
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

const createAds = (params, callback) => {
  console.log('params.length ', params.length);
  knex.batchInsert('ads', params)
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

const createSubscribersForChannels = (params, callback) => {
  knex.batchInsert('channels_subscriptions', params)
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
  createVideos: createVideos,
  createAds: createAds,
  createSubscribersForChannels: createSubscribersForChannels
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
// knex.transaction(function(tr) {
//   return knex.batchInsert('TableName', rows, chunkSize)
//     .transacting(tr)
//   })
//   .then(function() { ... })
//   .catch(function(error) { ... });