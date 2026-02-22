const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const db = require('./config');
const { collectDefaultMetrics, Registry, Histogram, Counter } = require('prom-client');
const app = express();
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

const register = new Registry();
collectDefaultMetrics({ register });

const httpRequestDurationMicroseconds = new Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
  buckets: [50, 100, 200, 300, 400, 500, 600, 800, 1000] // Buckets for response time from 50ms to 1000ms
});
register.registerMetric(httpRequestDurationMicroseconds);

const httpRequestCounter = new Counter({
  name: 'http_request_count',
  help: 'Count of HTTP requests',
  labelNames: ['method', 'route', 'code']
});
register.registerMetric(httpRequestCounter);

app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    const route = req.route ? req.route.path : req.path;
    httpRequestCounter.labels(req.method, route, res.statusCode).inc();
    end({ method: req.method, route, code: res.statusCode });
  });
  next();
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

const traineeRouter = require("./routes/traineeRoute");
const authRoute = require('./routes/authRoute');
app.use("/api/trainee", traineeRouter);
app.use("/api/auth", authRoute);

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
  db();
});

module.exports = app;
