const fs = require('fs');
const uuidv4 = require('uuid/v4'); 
const path = require('path');
const basePath = path.join(__dirname, '../datagenerators/');
const fileAssets = ['all-first.txt', 'all-last.txt'];
const Promise = require('bluebird');
let firstNames = [];
let lastNames = [];

/**
 * Reads three files to randomly generate the given number of data as
 *  json output with full names,
 * email address and a unique identifier to insert into the users table.
 */
const nameEmailUniqueIdGenerator = (number, callback) => {
  let t = process.hrtime();
  let emails = [];
  let ids = [];
  nameGenerator(number, (err, fullNames) => { 
    if (err) {
      console.log(err);
      callback(err, null);
    }
    emailGenerator(fullNames, (err, data) => {
      emails = data;
      uniqueIdGenerator(number, (err, idData) => {
        ids = idData;
        let data = {
          names: fullNames,
          ids: ids,
          emails: emails
        };
        callback(null, data);
        t = process.hrtime(t);
        console.log('time taken to execute ', t[0], t[1]);
      });
    }); 
  });
};

const uniqueIdGenerator = (number, callback) => {
  let ids = [];
  for (var i = 0; i < number; i++) {
    let id = uuidv4();
    // console.log(id);
    ids.push(id);
  }
  callback(null, ids);
};

// site-alias.stackpathdns.com/image.png
const urlGenerator = (number) => {
  let ulrs = [];

}

const emailGenerator = (fullNames, callback) => {
  let emails = [];
  for (var i = 0; i < fullNames.length; i++) {
    let emailName = fullNames[i].toLowerCase().split(' ').join('.');
    emails.push(emailName + '@email.com');
    let names = fullNames[i].split(' ');
    names[0] = names[0].toLowerCase();
    names[0] = names[0].charAt(0).toUpperCase() + names[0].slice(1);
    names[1] = names[1].toLowerCase();//)[0].toUpperCase();
    names[1] = names[1].charAt(0).toUpperCase() + names[1].slice(1);
    fullNames[i] = names.join(' ');
  }
  callback(null, emails);
};

const nameGenerator = (number, callback) => {
  let fullNames = [];
  fs.readFile(path.join(basePath, fileAssets[0]), 'utf8', (err, firstNamesData) => {
    if (err) {
      console.log('error reading file ' , path.join(basePath, fileAssets[0]));
    } else {
      firstNames =  firstNamesData.split('\n');
    }
  });

  fs.readFile(path.join(basePath, fileAssets[1]), 'utf8', (err, lastNamesData) => {
    if (err) {
      console.log('error reading file ', path.join(basePath, fileAssets[0]));
    } else {
      lastNames = lastNamesData.split('\n');
    }
    // console.log('firstNames ', firstNames);
    for (var i = 0; i < number; i++) {
      var firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      var lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      fullNames.push(firstName + ' ' + lastName);
    }
    callback(null, fullNames);
  });
 
};

module.exports = {
  dg: nameEmailUniqueIdGenerator
};