const fs = require('fs');
// const uuidv4 = require('uuid/v4'); 
const path = require('path');
const basePath = path.join(__dirname, '../datagenerators/');
const fileAssets = ['videosubsetData.json'];
const Promise = require('bluebird');
const faker = require('faker');
var randomstring = require("randomstring");
const db = require('../database/index.js');

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

const createVideos = () => {
  var rstream = fs.createReadStream(path.join(__dirname,'videosubsetData.json'));
  var videosubsets = [];
  rstream.on('data', (chunk) => {
    videosubsets += chunk;
  })
  .on('end', () => {
    videosubsets = JSON.parse(videosubsets);
    console.log('videosubsets.length ', typeof videosubsets);
  });
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
  createVideos: createVideos
  // dg: nameEmailUniqueIdGenerator,
  // videosGenerator: videosGenerator,
  // writeChannelsToFile: writeChannelsToFile
};

// var knex = require('knex')(config)
// var fs = require('fs')
// var copyFrom = require('pg-copy-streams').from

// knex.client.pool.acquire(function(err, client){
//   function done (err) {
//     connection.client.pool.release(client)
//     if (err) console.log(err)
//     else console.log('success')
//   }
//   var stream = client.query(copyFrom('COPY my_table FROM STDIN'))
//   var fileStream = fs.createReadStream('some_file.tdv')
//   fileStream.on('error', done)
//   fileStream.pipe(stream).on('finish', done).on('error', done)
// })