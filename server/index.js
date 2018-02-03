const express = require('express');
const path = require('path');
const parser = require('body-parser');
const promise = require('bluebird');
const dataGenerator = require(path.join(__dirname, '../datagenerators/dataGeneratorHelper.js'));
const filePath = path.join(__dirname, '../datagenerators/dataGeneratorHelper.js');
const db = require('../database/index.js');



const app = express();

app.get('/', function(req, res){

  dataGenerator.generateSubscribersForChannels();
  res.status(200);
 
});

app.get('/videos/video', (req, res) => {

});

app.listen(3000, () => {
  console.log('listening on port 3000!');
});

// /inventory/ homepage
// /inventory/video/<id> [get a video given videoid]
// /inventory/video/create/
// /inventory/user/<id>[ get a user given userid]
// /inventory/user/subscribed/<id>[is user subscribed]
// /user/subscribe
