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
 * that have ids between 610000 and 1506886 [957886] - //[610000, 1506886]).
 * Publishers have been picked from the range of 
 * [555200, 610000]. This is to avoid equal ids for
 * subscribers and publishers though in reality subscribers
 * can be publishers and publishers can be subscribers to other's
 * channels. I am trying a second range of subscribers with id's
 * 1506887 and 3845786 to fill the channels table [1506887, 3845786]).
 */
const selectUsers = (callback) => {                       //publishers  
  knex.from('users').select('userid').whereBetween('id', [555200, 610000])
  .then((records) => {
    callback(records);
  });
};
/**
 * starting index: 272565; the rest not selected
 * */ 
const selectChannels = (callback) => {
  knex.from('channels').select('channel_id', 'publisher_id').whereBetween([272565 , 1169450])
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

/**
 * 
 * @param params is of the type {video_id: ''}  
 * @param {*} callback 
 */
const selectVideoFromVideos = (params, callback) => {
  knex.select('*')
  .from('videos')
  .where(params)
  .then(function(rows) {
    callback(rows);
  })
  .catch(function(error) { console.error(error); });
};

/**
 * 
 * @param {*} params 
 * {channel_id: 'channelid', subscriber_id:  'Userid'}
 * @param {*} callback 
 */
const selectSubscribersForChannels = (params, callback) => {
  knex.select(1)
  .from('channels_subscriptions')
  .where(params)
  .then(function(rows) {
    callback(rows);
  })
  .catch(function(error) { console.error(error); });
};

module.exports = {
  createUser: createUser,
  createVideo: createVideo,
  selectUsers: selectUsers,
  createChannels: createChannels,
  selectChannels: selectChannels,
  createVideos: createVideos,
  createAds: createAds,
  createSubscribersForChannels: createSubscribersForChannels,
  selectVideoFromVideos: selectVideoFromVideos,
  selectSubscribersForChannels: selectSubscribersForChannels
};