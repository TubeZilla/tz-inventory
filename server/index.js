const express = require('express');
const path = require('path');
const parser = require('body-parser');
const promise = require('bluebird');
const dataGenerator = require(path.join(__dirname, '../datagenerators/dataGeneratorHelper.js'));
const filePath = path.join(__dirname, '../datagenerators/dataGeneratorHelper.js');
const db = require('../database/index.js');



const app = express();

app.get('/', function(req, res){
  
  res.status(200);
 
});

app.listen(3000, () => {
  console.log('listening on port 3000!');
});

