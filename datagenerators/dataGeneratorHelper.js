const fs = require('fs');
// const uuidv4 = require('uuid/v4'); 
const path = require('path');
const basePath = path.join(__dirname, '../datagenerators/');
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
  createChannels: createChannels
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