const rateLimit = require('express-rate-limit');

const rateLimitMiddleware = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 10, 
  handler: (req, res) => {
    res.status(409).send({ message: 'Too many requests, please try again later.' });
  },
});

module.exports = rateLimitMiddleware;