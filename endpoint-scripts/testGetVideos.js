const request = require('request');
const fs = require('fs');
const fetch = require('node-fetch');
// const expect = require('chai').expect;
// const pg = require('pg');
const path = require('path');
const Promise = require('bluebird');
const videoFile = path.join(__dirname, '../datagenerators/videoids.txt');

fetch.Promise = Promise;

const readFile = async (fileName, callback) => {
  const readStream = await fs.createReadStream(fileName, 'utf8');
  let contents = '';
  readStream.on('data', chunk => {
    contents += chunk.toString()  ;
  })
  readStream.on('end', () => {
    // console.log('file contents ', contents);
    contents = contents.split('\n');
    callback(null, contents);
  });
}; 

const makeVideoRequest = (videoId) => {
  // console.log('in make video Request ', videoId);
  let url = `http://localhost:3000/api/video/:${videoId}`;

  fetch(url, {
    method: 'GET',
    headers: {
        "Content-Type": "application/json"
    }
})
.then((data) => {
  data.json();
})
.then((data) => {
  //#TODO: query the database with the same video_id and 
  //compare if the data matches.
  // console.log(data);
})
.catch(err => {
  console.error(err);
});
};

const getVideoAPICall = () => {
  readFile(videoFile, (err, videos) => {
    // console.log('videos', videos, typeof videos);
    for (let video of videos) {
      if (video !== '') {
        makeVideoRequest(video);
      }
    }
  });   
};


getVideoAPICall();