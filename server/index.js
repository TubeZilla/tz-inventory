const nr = require('newrelic');
const express = require('express');
const path = require('path');
const parser = require('body-parser');
const promise = require('bluebird');
const dataGenerator = require(path.join(__dirname, '../datagenerators/dataGeneratorHelper.js'));
const filePath = path.join(__dirname, '../datagenerators/dataGeneratorHelper.js');
const db = require('../database/index.js');
const router = require('./routes.js');
const controller = require('./controllers');
const cluster = require('cluster');

//Add Morgan

if (cluster.isMaster) {
  let cpuCount = require('os').cpus().length;
  for (var i = 0; i < cpuCount; i++) {
    cluster.fork();
  }
} else {
  const app = express();
  app.use(parser.json());
  app.use('/api', router);

  // controller.loadAds((err, result) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     app.emit('started');
  //   }
  // });

  let server = app.listen(3000, () => {
    console.log('listening on port 3000!', cluster.worker.id);  
  });

  // const stop = (done) => {
  //   server.close();
  //   done();
  // }
  exports = module.exports = app;
}
//{app: app,
                            // stop: stop};