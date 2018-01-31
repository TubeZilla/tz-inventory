const fs = require('fs');
const uuidv4 = require('uuid/v4'); 
const path = require('path');
const basePath = path.join(__dirname, '../datagenerators/');
const Promise = require('bluebird');




module.exports = {
  dg: nameEmailUniqueIdGenerator,
  videosGenerator: videosGenerator,
  writeChannelsToFile: writeChannelsToFile
};