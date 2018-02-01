const schema = require('./schema.js');
var knex = require('./knex.js').knex;
var Promise = require('bluebird');

//params is an array of json objects that will be need to be mapped
//to each users record column
const createUser = (params, callback) => {
  // let t = process.hrtime();
  // let inserts = [];
  // for (var i = start; i < end; i++) {
  //   // console.log(params[i]);
  //   // let insert = {username: params[i][0], email: params[i][1], userid: params[i][2]};
  //   inserts.push(params[i]);
  // }
  
  knex.insert(params).into('users')
  .then((id) => {
    console.log(id);
    callback(null, id);
  });
  // t = process.hrtime(t);
  // console.log('time taken to execute user insertions', t[0], t[1]);
};

//params is an array of json that has already been mapped
//to videos record column
const createVideo = (params, start, end, callback) => {
  // console.log(params);
  let inserts = [];
  for (var i = start; i < end; i++) {
    // console.log(params[i], typeof params[i]);
    inserts.push(params[i]);
  }
  knex.insert(inserts).into('videos')
  .then((id) => {
    callback(null, id);
  });
};

module.exports = {
  createUser: createUser,
  createVideo: createVideo
};