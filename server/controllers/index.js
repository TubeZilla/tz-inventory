const db = require('../../database/index.js');
var randomstring = require("randomstring");
var redisClient = require('../redis.js');


let ads = [];

module.exports = {
  videos: {
    get: (req, res) => {
      var t = process.hrtime();
      var videoid = req.params['videoId'].split(':')[1];
      // console.log(videoid);
      var params = {video_id: videoid};
      // console.log('params ', params);
      if (videoid === '') {
        res.status(400);
      }
      redisClient.get(videoid, (error, video) => {
        console.log('video from redis ', video);
        video = JSON.parse(video);
        if (video !== null) {
          sendResponse(video, t, res);
        } else {
          db.getVideo(params, (err, video) => {
            video = Object.assign({}, video);
            // console.log('video from db ', video);
            redisClient.set(videoid, JSON.stringify(video));
            sendResponse(video, t, res);
          });
        }  
      });
    },
    post: (req, res) => {
      var videoid = randomstring.generate(12);
      // console.log('videoid ', videoid);
      let params = {
        video_id: videoid, 
        video_title: req.body.video_title,
        video_description: req.body.video_description,
        channel_id: req.body.channel_id,
        publisher_id: req.body.publisher_id,
        video_length_in_mins: req.body.video_length_in_mins,
        video_cdn_link: 'http://dummyimage.com/233x155.png/5fa2dd/ffffff',
        video_s3_link:  'http://dummyimage.com/122x181.jpg/dddddd/000000'     
    }
    if (params.video_id === undefined || params.video_title === undefined 
      || params.channel_id === undefined || params.publisher_id === undefined
      || params.video_length_in_mins === undefined) {
        res.status(400);
      }
    db.createVideo(params, (err, result) => {
      var data = {
        publisher_id: req.body.publisher_id,
        video_cdn_link: 'http://dummyimage.com/233x155.png/5fa2dd/ffffff',
        videoid: videoid
    }
      res.status(201).json(data);
    });  
  }
},
  //select 1 from channels_subscriptions where subscriber_id = 'X9SY9sFnlOMX' and channel_id = 'HFcmVS5AdIBG';
  subscriptions: {
    get: (req, res) => {
      var subscriberId = req.params['subscriberId'].split(':')[1];
      var channelId = req.params['channelId'].split(':')[1];
      if (subscriberId === undefined || channelId === undefined) {
        res.status(400);
      }
      var param = {channel_id: channelId, subscriber_id: subscriberId};
      db.getSubscriber(param, (err, result) => {
        // console.log('flag ', result[0]['?column?']);
        var flag;
        if (result.length === 0) {
          flag = false;
        } else {
          flag = result[0]['?column?'] >= 1;
        }
        res.json({hasSubscribed: flag});
      });
    },

    post: (req, res) => {
      var subscriberId = req.body['subscriberId'];
      var channelId = req.body['channelId'];
      var publisherId = req.body['publisherId'];
      if (subscriberId === undefined || channelId === undefined 
      || publisherId === undefined) {
        res.status(400);
      }
      var params = {channel_id: channelId, subscriber_id: subscriberId,
      publisher_id: publisherId};
      db.createSubscriberForChannel(params, (err, result) => {
        console.log('result from db ', result);
        if (err) {
          res.status(500);
        }
        res.status(201).json(result);
      });  
    }
  },
  users: {
    post: (req, res) => {

    }
  },

  loadAds: (callback) => {
    db.getAds((err, ads) => {
      // console.log('ads ', ads[0]);
      if (err) {
        callback(err, null);
      }
      callback(null, ads);
      console.log('ads.length ', ads.length);
    });
  }
};

module.exports.loadAds((err, adsData) => {
  if (err) {
    console.log(err);
  } else {
    ads = adsData;
    module.exports.Ready = true;
  }
});

const sendResponse = (video, t, res) => {
  var ad = getAd();
  var data = {ad: ad, video: video};
  console.log('video data ',data);
  res.json(data);
  t = process.hrtime(t);
  console.log(`time taken to serve an ad and video is ${t[1] / 1000000}`);
};

const getAd = () => {
  var ad = ads[~~(Math.random() * ads.length)];
  ad.click_id = randomstring.generate(10);
  ad.impression_id = randomstring.generate(10);
  return ad;
};

module.exports.Ready = false;

// curl -X POST -H "Content-Type: application/json" -d '{"video_title":"Sense and Sensibility","video_description":"condimentum neque sapien placerat ante","channel_id":"M5xAaG1RrkUq","publisher_id":"z0OmqDyZpKHO","video_length_in_mins":"32"}' http://localhost:3000/api/video/create