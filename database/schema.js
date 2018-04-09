var Promise = require('bluebird');
var knex = require('./knex.js').knex;

knex.schema.createTableIfNotExists('users', function (table) {
  table.string('username');
  table.string('email');
  table.increments('id');
  table.string('userid');
  table.timestamps('created_at');
  table.string('location');
})
.then(function() {
});

knex.schema.createTableIfNotExists('videos', function (table) {
  table.increments('id');
  table.string('video_id');
  table.string('title');
  table.string('short_description');
  table.string('channel_id');
  table.string('publisher_id');
  table.timestamps('created_at');
  table.string('cdn_link');
  table.string('s3_link');
  table.integer('video_length_in_mins');
})
.then(function() {
});

knex.schema.createTableIfNotExists('ads', function(table) {
  table.increments('id');
  table.string('ad_id');
  table.string('ad_text');
  table.timestamps('created_at');
  table.string('ad_video_cdn_link');
  table.string('ad_video_s3_link');
  table.integer('ad_length_in_mins');
})
.then(function() {

});

knex.schema.createTableIfNotExists('channels', function(table) {
  table.increments('id');
  table.string('channel_id');
  table.string('publisher_id');
  table.string('channel_name');
})
.then(function() {

});

knex.schema.createTableIfNotExists('channels_subscriptions', function(table) {
  table.increments('id');
  table.string('channel_id');
  table.string('publisher_id');
  table.string('subscriber_id');
})
.then(function() {

});


