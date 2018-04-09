// process.env.NODE_ENV = 'test';

const chai = require('chai');
const request = require('supertest');
const should = chai.should();
// const chaiHttp = require('chai-http');
// chai.use(chaiHttp);
const server = require('../server/index.js');
const serverURL = 'http://localhost:3000';
const agent = request.agent(server);

  before(function (done) {
    server.on('started', () => {
      done();
    });  
  });

  describe('GET /api/video/:videoId', () => {  
    it('should respond with a single video', function(done) {
      agent
      .get('/api/video/:YxwYJQK4XZVt')
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 200 status code
        res.status.should.equal(200);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"data": 1 movie object}
        res.body.video.should.include.keys(
          'video_id', 'video_title', 'channel_id', 'video_cdn_link', 'video_length_in_mins');
        res.body.ad.should.include.keys(
          'ad_id', 'ad_text', 'ad_video_cdn_link', 'ad_length_in_secs',
          'click_id', 'impression_id');
        res.body.video.video_id.should.equal("YxwYJQK4XZVt");
        res.body.video.channel_id.should.equal('M5xAaG1RrkUq');
        done();
      });
    });
  });

  //test by deleting all keys from redis
  //keep changing the video_id's as they are going to be cached in 
  //redis once they are queried
  //first list for tests  m1Z28YSs9M1J, edxkEX3w9hFg, MLEYsqA5xqYm
  //qlkokpnUVz7L; 
  describe('GET a video if video_id not already in redis', () => {
    it('should respond with a video by querying database', (done) => {
      agent
      .get('/api/video/:MLEYsqA5xqYm')
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.video.should.include.keys(
          'video_id', 'video_title', 'channel_id', 'video_cdn_link', 'video_length_in_mins');
        res.body.ad.should.include.keys('ad_id', 'ad_text', 'ad_video_cdn_link', 'ad_length_in_secs',
        'click_id', 'impression_id');
        res.body.video.video_id.should.equal('MLEYsqA5xqYm');
        res.body.video.channel_id.should.equal('HFcmVS5AdIBG');
        done();
      });
    });
  });

  describe('Post /api/video/create', () => {
    it('should return the metadata of video uploaded', function(done) {
      agent
      .post('/api/video/create')
      .send({video_title: 'Port of Flowers',
        video_description: 'Mauris enim leo, rhoncus sed, vestibulum',
        channel_id: 'M5xAaG1RrkUq',
        publisher_id: 'z0OmqDyZpKHO',
        video_length_in_mins: '316'
      })
      .end((err, res) => {
        console.log('res body', res.body);
        should.not.exist(err);
        res.status.should.equal(201);
        res.type.should.equal('application/json');
        res.body.should.include.keys('video_cdn_link', 'videoid',
      'publisher_id');
        done();
      })
    });
  }); 
  
  describe('Get user/subscribed to channel(truthy test)', () => {
    var subscriberId = '8ObFe52XszqQ';
    var channelId = 'M5xAaG1RrkUq';
    it('should return true if user is subscribed to channel', function(done) {
      agent
      .get(`/api/user/subscribed/:${subscriberId}/channel/:${channelId}`)
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.should.include.keys('hasSubscribed');
        res.body.hasSubscribed.should.equal(true);
        done();
      }); 
    });
  });

  describe('Get user/subscribed to channel (falsy test)', () => {
    var subscriberId = 'wEtMAThYhv1G';
    var channelId = 'M5xAaG1RrkUq';
    it('should return false if user not subscribed to channel', function(done) {
      agent
      .get(`/api/user/subscribed/:${subscriberId}/channel/:${channelId}`)
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.should.include.keys('hasSubscribed');
        res.body.hasSubscribed.should.equal(false);
        done();
      })
    });
  });

  describe('Post user subscribes to a channel', () => {
    var channelId = 'M5xAaG1RrkUq';
    var subscriberId = '0X6QFgg8OXUx';
    var publisherId = 'z0OmqDyZpKHO';
    it('Post /user/subscribe', (done) => {
      agent
      .post(`/api/user/subscribe`)
      .send({channelId: channelId, subscriberId: subscriberId,
      publisherId: publisherId})
      .end((err, res) => {
        console.log('res after subscribe', res.body);
        should.not.exist(err);
        res.status.should.equal(201);
        // res.body.should.include
        done();
      })
    });
  });