const fs = require('fs');
// const uuidv4 = require('uuid/v4'); 
const path = require('path');
const basePath = path.join(__dirname, '../datagenerators/');
const fileAssets = ['videosubsetData.json'];
const Promise = require('bluebird');
const faker = require('faker');
var randomstring = require("randomstring");
const db = require('../database/index.js');
const csvStringify = require('csv-stringify');


const generateSubscribersForChannels = () => {
  let subscriberChannels = [];
  db.selectChannels(channels => {
    console.log('records.length ', channels.length);
    db.selectUsers((subscribers) => {
      console.log('subscribers.length ', subscribers.length);
      for (var i = 0; i < channels.length; i++) {
        var subscriberChannel = {};
        subscriberChannel['channel_id'] = channels[i]['channel_id'];
        subscriberChannel['publisher_id'] = channels[i]['publisher_id'];
        subscriberChannel['subscriber_id'] = subscribers[i]['userid'];
        subscriberChannels.push(subscriberChannel);
      }
      db.createSubscribersForChannels(subscriberChannels, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
        }
      });
    });
    // var writeStream = fs.createWriteStream(`test.csv`, 'utf8');
    // csvStringify(records, (error, output) => {
    //   writeStream.write(output, 'utf8');
    //   writeStream.end();
    //   console.log('Done with:', records.length);
    // });
  });
};

/**
 * Generate users
 * @param {*} number 
 * @param {*} callback 
 */
const generateUsers = (number, callback) => {
  console.log('in generateUsers');
  var t = process.hrtime();
  var n = 1000;
  while(n-- >= 0) {
    generateUserData((err, users) => {
      db.createUser(users, (err, id) => {
        if (err) {
          console.log(err);
        }
        console.log(id);
        // callback(id);
      });
    }); 
  }  
  t = process.hrtime(t);
  console.log('time taken to execute user insertions', t[0], t[1]);
callback(null, null);
}
/**
 * Helper function
 * @param {*} callback 
 */
const generateUserData = (callback) => {
  let users = [];
  let end = 5000;
  count = 1;
  for (var i = 0; i < end; i++) {
    let user = {
      username: faker.name.findName(),
      email: faker.internet.email(),
      userid: randomstring.generate(12) //faker.random.alphaNumeric(11)
    };
    users.push(user);
  }
  callback(null, users);
};

const createChannels = () => {
  db.selectUsers((records) => {
    let publishers = records;
    console.log(publishers.length);
    for (var i = 0; i < publishers.length; i++) { //
      let channels = [];
      for (var j = 0; j < 10  ; j++) { 
        var channel = {};
        channel['channel_id'] = randomstring.generate(12);
        channel['channel_name'] = faker.commerce.productName();
        channel['publisher_id'] = publishers[i]['userid'];
        channels.push(channel);
      }  
      db.createChannels(channels, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
        }
      });
    }
  });
};
/**
 * First selects the channel information from channels table
 * and then generates multiple videos for each channel
 */
const createVideos = () => {
  var rstream = fs.createReadStream(path.join(__dirname,'videosubsetData.json'));
  var videosubsets = [];
  rstream.on('data', (chunk) => {
    videosubsets += chunk;
  })
  .on('end', () => {
    videosubsets = JSON.parse(videosubsets);
    console.log('videosubsets.length ', typeof videosubsets);
    db.selectChannels(records => {
      console.log('count of records ', records.length);
      for (var i = 0; i < 2; i++) { 
        let videos = [];
        for (var j = 0; j < records.length; j++) {//
          var videosubset = videosubsets[~~(videosubsets.length * Math.random())]
          // console.log(videosubset);
          var video = {};
          video['video_id'] = randomstring.generate(12);
          video['channel_id'] = records[i]['channel_id'];
          video['publisher_id'] = records[i]['publisher_id'];
          video['video_title'] = videosubset['video_title'];
          video['video_description'] = videosubset['video_description'];
          video['video_length_in_mins'] = videosubset['video_length_in_mins'];
          video['video_cdn_link'] = videosubset['video_cdn_link'];
          video['video_s3_link'] = videosubset['video_s3_link '];
          videos.push(video);
        }
        db.createVideos(videos, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            console.log(result);
          }
        });
      }  
    });
  });
};

/**
 * Generate ads
 */
const generateAds = () => {
  var rstream = fs.createReadStream(path.join(__dirname,'videosubsetData.json'));
  var adsubsets = [];
  rstream.on('data', (chunk) => {
    adsubsets += chunk;
  })
  .on('end', () => {
    adsubsets = JSON.parse(adsubsets);
    console.log('adsubsets.length ', adsubsets.length);
    var ads = [];
    for (var j = 0; j < adsubsets.length; j++) {
      var adsubset = adsubsets[j]
      // console.log(videosubset);
      console.log(j);
      var ad = {};
      ad['ad_id'] = randomstring.generate(12);
      ad['ad_text'] = adsubset['video_title'];
      ad['ad_length_in_secs'] = ~~(Math.random() * 60);
      ad['ad_video_cdn_link'] = adsubset['video_cdn_link'];
      ad['ad_video_s3_link'] = adsubset['video_s3_link '];
      ads.push(ad);
      // console.log(ad);
    }
    db.createAds(ads, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
    });
  });
};

//helper function to write to file
const writeFile = (path, data, opts='utf8') => {
  console.log('herein write file');
  new Promise((resolve, reject) => {
      fs.writeFile(path, data, opts, (err) => {
          if (err) {
            reject(err);
          }  
          else {
            resolve();
          }
      });
  })
  .then(() => {
    console.log('created file ' + path);
  });
};

module.exports = {
  gu: generateUsers,
  createChannels: createChannels,
  createVideos: createVideos,
  generateAds: generateAds,
  generateSubscribersForChannels: generateSubscribersForChannels
};

// select * from channels_subscriptions where subscriber_id = userid
// and channel_id in (select channel_id from videos where video_id = videoid);

// select * from channels_subscriptions where subscriber_id = useridX9SY9sFnlOMX
// and channel_id = channelId;HFcmVS5AdIBG
// select 1 from channels_subscriptions where subscriber_id = 'HFcmVS5AdIBG' and channel_id = 'HFcmVS5AdIBG';