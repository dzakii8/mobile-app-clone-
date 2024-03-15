const Redis = require("ioredis");

const redis = new Redis({
  host: 'redis-13532.c292.ap-southeast-1-1.ec2.cloud.redislabs.com',
  port: 13532,
  username: "default", // needs Redis >= 6
  password: process.env.REDIS_PASSWORD,
  db: 0, // Defaults to 0
});

module.exports = redis