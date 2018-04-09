var redis = require('redis');
var redisClient = redis.createClient({host: 'redis_instance3'/*'127.0.0.1'*/, port: 6379});
redisClient.on('ready', () => {
  console.log('Redis is ready');
});

redisClient.on('error', () => {
  console.log('Error in Redis');
});

module.exports = redisClient;