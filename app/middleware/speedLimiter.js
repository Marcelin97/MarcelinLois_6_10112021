const slowDown = require("express-slow-down"); 

// allow 200 reqs/min, reqs after that are delayed by 2500ms
const rateSpeedLimit = slowDown({
  delayAfter: 100, // slow down limit (in reqs)
  windowMs: 15 * 60 * 1000, // time where limit applies
  delayMs: 500, // begin adding 500ms of delay per request above 100:
  // request # 101 is delayed by  500ms
  // request # 102 is delayed by 1000ms
  // request # 103 is delayed by 1500ms
  // etc.
});

module.exports = rateSpeedLimit;