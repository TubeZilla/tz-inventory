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

//params is an json whose values have been mapped
//to columns in the videos table in the database
const createVideo = (params, callback) => {
  knex.insert(params).into('videos')
  .then((id) => {
    console.log('after insert in db', id);
    callback(null, id);
  })
  .catch((err) => {
    console.log(err);
    callback(err);
  });
};

/**
 * Publishers have been picked from the range of 
 * [555200, 610000].
 * Subscribers have been picked from another subset of users
 * that have ids between 610000 and 1506886 [957886] - //[610000, 1506886]).
 * This is to avoid equal ids for
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

/**
 * expects an array of video objects, used
 * for batch inserts
 * @param {*} params 
 * @param {*} callback 
 */
const createVideos = (params, callback) => {
  console.log('params.length ', params.length);
  knex.batchInsert('videos', params)
    .returning('id')
    .then(function(ids) { 
      //  console.log(ids);
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

const getAds = (callback) => {
  console.log('In getAds');
  knex.select('ad_id', 'ad_text', 'ad_video_cdn_link', 'ad_length_in_secs').from('ads')
  .then((rows) => {
    callback(null, rows);
  })
  .catch((err) => {
    console.log(err);
    callback(err);
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
 * Given a video id, give the video metadata 
 * associated with it
 * @param params is of the type {video_id: ''}  
 * @param {*} callback 
 */
const getVideo = (params, callback) => {
  // console.log('params ', params);
  knex.select('video_id', 'video_title', 'channel_id', 'video_cdn_link', 'video_length_in_mins')
  .from('videos')
  .where(params)
  .then(function(rows) {
    // console.log('video from db ', rows[0]);
    callback(null, rows[0]);
  })
  .catch(function(error) {
    console.error(error);
  });
};

/**
 * Given a channelid and subscriber id check if user
 * is subscribed for the channel
 * @param {*} params are of the form
 * {channel_id: 'channelid', subscriber_id:  'Userid'}
 * @param {*} callback 
 */
const getSubscriber = (params, callback) => {
  console.log('params ', params);
  knex.select(1)
  .from('channels_subscriptions')
  .where(params)
  .then(function(rows) {
    console.log('rows ', rows);
    callback(null, rows);
  })
  .catch(function(error) { console.error(error); });
};

const createSubscriberForChannel = (params, callback) => {
  knex.insert(params).into('channels_subscriptions')
  .then((id) => {
    console.log(id);
    callback(null, id);
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
  createSubscribersForChannels: createSubscribersForChannels,
  getVideo: getVideo,
  getAds: getAds,
  getSubscriber: getSubscriber,
  createVideo: createVideo,
  createSubscriberForChannel: createSubscriberForChannel
};