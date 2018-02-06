const express = require('express');
const path = require('path');
const parser = require('body-parser');
const promise = require('bluebird');
const dataGenerator = require(path.join(__dirname, '../datagenerators/dataGeneratorHelper.js'));
const filePath = path.join(__dirname, '../datagenerators/dataGeneratorHelper.js');
const db = require('../database/index.js');
const router = require('./routes.js');
var controller = require('./controllers');

const app = express();

app.use(parser.json());
app.use('/inventory', router);

app.listen(3000, () => {
  console.log('listening on port 3000!');
});
