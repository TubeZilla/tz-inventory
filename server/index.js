const express = require('express');
const path = require('path');
const parser = require('body-parser');
const promise = require('bluebird');
const dataGenerator = require(path.join(__dirname, '../datagenerators/dataGeneratorHelper.js'));
const filePath = path.join(__dirname, '../datagenerators/dataGeneratorHelper.js');
console.log(filePath);
const app = express();

app.get('/', function(req, res){
  // res.send('hello world');
  // console.log(dataGenerator);
  dataGenerator.dg(50000, (err, data) => {
    if (err) {
      res.send(err);
      console.log('in error');
    }
    res.status(201).json(data);
  });
});

app.listen(3000, () => {
  console.log('listening on port 3000!');
});