// middleware de limitation de débit pour notre API
const rateLimit = require("express-rate-limit");

const rateLimiterUsingThirdParty = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hrs in milliseconds
  max: 100, // This represents the number of allowed requests per window per user
//   message: "You have exceeded the 100 requests in 24 hrs limit!",
    headers: true,
    handler: function (req, res, /*next*/) {
        return res.status(429).json({
            error: 'You sent too many requests. Please wait a while then try again'
        })
    }
});

module.exports = rateLimiterUsingThirdParty;