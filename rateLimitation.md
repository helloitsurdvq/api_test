### Endpoint rate limitation
To implement rate limiting strategy for the api service, the `express-rate-limit` are used. This package primarily uses implementation that can be considered as a combination of the **token bucket** and **leaky bucket** algorithms. It provides the following features:

- *Fixed Window Counter*: tracks the number of requests in a fixed time window (e.g., 1 minute). When the window expires, the count resets.
- *Sliding Window Counter*: can be configured to track requests in a sliding window, providing a more dynamic view of the request rate.
- *Burst Handling*: by setting the 'max' value, the middleware can handle bursts of traffic up to the specified limit within the given time window (windowMs).

This middleware allows to set up rate limiting rules easily, helps to ensure that the application can handle a high volume of requests without getting overwhelmed.

```shell
# Install package
npm install express-rate-limit
```

The source code to deal with the issue can be found [here](https://github.com/helloitsurdvq/VDT2024-api).

```javascript
const rateLimit = require('express-rate-limit');

const rateLimitMiddleware = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 10, 
  handler: (req, res) => {
    res.status(409).send({ message: 'Too many requests, please try again later.' });
  },
});

module.exports = rateLimitMiddleware;
```
Explain:
- `windowMs` specifies the duration of the time window.
- `max` specifies the maximum number of requests allowed within the time window.
- `handler` is a custom response when the rate limit is exceeded.
- Usage: The configured middleware is exported and can be applied to the application or specific routes to enforce rate limiting.

```javascript
const rateLimitMiddleware = require('../middlewares/rateLimitMiddleware');
const router = express.Router();

router.use(rateLimitMiddleware);

module.exports = router;
```

If the limit is exceeded, the client will receive a `409 Conflict` response. This helps in preventing abuse and managing traffic effectively.

The outcome when testing on Postman:

![img](https://raw.githubusercontent.com/helloitsurdvq/VDT2024project/main/assets/9.3_security_manyreqs.jpg)

![img](https://raw.githubusercontent.com/helloitsurdvq/VDT2024project/main/assets/9.4_security_manyreqs_log.png)