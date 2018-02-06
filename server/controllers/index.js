const db = require('../../database/index.js');
var randomstring = require("randomstring");
var redis = require('redis');
var redisClient = redis.createClient({host: 'localhost', port: 6379});
redisClient.on('ready', () => {
  console.log('Redis is ready');
});

redisClient.on('error', () => {
  console.log('Error in Redis');
});

let ads = [];

module.exports = {
  videos: {
    get: (req, res) => {
      var t = process.hrtime();
      var videoid = req.params['videoId'].split(':')[1];
      var params = {video_id: videoid};
      redisClient.get(videoid, (error, video) => {
        video = JSON.parse(video);
        if (video !== null) {
          sendResponse(video, t, res);
        } else {
          db.getVideo(params, (err, video) => {
            redisClient.set(videoid, JSON.stringify(Object.assign({}, video)));
            sendResponse(video, t, res);
          });
        }  
      });
    },

    post: (req, res) => {
      var videoid = randomstring.generate(12);
      let params = {
        video_id: videoid, 
        video_title: req.body.videotitle,
        video_description: req.body.videodescription,
        channel_id: req.body.channelid,
        publisher_id: req.body.userid,
        video_cdn_link: 'http://dummyimage.com/233x155.png/5fa2dd/ffffff',
        video_s3_link:  'http://dummyimage.com/122x181.jpg/dddddd/000000',
        video_length_in_mins: req.body.videolength
    }
    db.createVideo(params, (err, result) => {
      var data = {
        publisher_id: req.body.userid,
        video_cdn_link: 'http://dummyimage.com/233x155.png/5fa2dd/ffffff',
        videoid:videoid
    }
      res.json(data);
    });  
  }
},
  //select 1 from channels_subscriptions where subscriber_id = 'X9SY9sFnlOMX' and channel_id = 'HFcmVS5AdIBG';
  subscriptions: {
    get: (req, res) => {
      var subscriberId = req.params['subscriberId'].split(':')[1];
      var channelId = req.params['channelId'].split(':')[1];
      var param = {channel_id: channelId, subscriber_id: subscriberId};
      db.getSubscriber(param, (err, result) => {
        // console.log('flag ', result[0]['?column?']);
        var flag;
        if (result.length === 0) {
          flag = false;
        } else {
          flag = result[0]['?column?'] === 1;
        }
        res.json({hasSubscribed: flag});
      });
    },

    post: (req, res) => {
      var subscriberId = req.body['subscriberId'];
      var channelId = req.body['channelId'];
      var publisherId = req.body['publisherId'];
      var params = {channel_id: channelId, subscriber_id: subscriberId,
      publisher_id: publisherId};
      db.createSubscriberForChannel(params, (err, result) => {
        res.sendStatus(201);
      });  
    }
  },
  users: {
    post: (req, res) => {

    }
  }
};

const sendResponse = (video, t, res) => {
  var ad = getAd();
  var data = {ad: ad, video: video};
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

const loadAds = (callback) => {
  db.getAds((err, ads) => {
    // console.log('ads ', ads[0]);
    if (err) {
      callback(err, null);
    }
    callback(null, ads);
    console.log('ads.length ', ads.length);
  });
};

loadAds((err, adsData) => {
  if (err) {
    console.log(err);
  } else {
    ads = adsData;
  }
});