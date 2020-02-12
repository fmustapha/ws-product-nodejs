const express = require("express");
const path = require('path');
const pg = require("pg");
const dotenv = require("dotenv");


dotenv.config();

const app = express();
// configs come from standard PostgreSQL env vars
// https://www.postgresql.org/docs/9.6/static/libpq-envars.html
const pool = new pg.Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
});

//Rate-limiting middleware
const limiter = (req, res, next) => {
  let limit = 2000; //bytes
  const packet = req && req.socket.bytesRead;
  if (limit >= packet) {
    const interval = process.env.INTERVAL;
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(next());
      }, interval);
    }).then()
  } else {
    limit = 2000;
    res && res
      .status(503)
      .send({ message: "Too many requests, try again in a minute" })
      .end()
    limiter();
  }
  limit -= packet;
};

// Query handler middleware
const queryHandler = (req, res, next) => {
  pool
    .query(req.sqlQuery)
    .then(r => {
      return res.json(r.rows || []);
    })
    .catch(next);
};
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get("/", limiter, (req, res) => {
  res.send("Welcome to EQ Works 😎");
});

app.get(
  "/events/hourly",
  limiter,
  (req, res, next) => {
    req.sqlQuery = `
    SELECT date, hour, events
    FROM public.hourly_events
    ORDER BY date, hour
    LIMIT 168;
  `;
    return next();
  },
  queryHandler
);

app.get(
  "/events/daily",
  limiter,
  (req, res, next) => {
    req.sqlQuery = `
    SELECT date, SUM(events) AS events
    FROM public.hourly_events
    GROUP BY date
    ORDER BY date
    LIMIT 7;
  `;
    return next();
  },
  queryHandler
);

app.get(
  "/stats/hourly",
  limiter,
  (req, res, next) => {
    req.sqlQuery = `
    SELECT date, hour, impressions, clicks, revenue
    FROM public.hourly_stats
    ORDER BY date, hour
    LIMIT 168;
  `;
    return next();
  },
  queryHandler
);

app.get(
  "/stats/daily",
  limiter,
  (req, res, next) => {
    req.sqlQuery = `
    SELECT date,
        SUM(impressions) AS impressions,
        SUM(clicks) AS clicks,
        ROUND(SUM(revenue), 2) AS revenue
    FROM public.hourly_stats
    GROUP BY date
    ORDER BY date
    LIMIT 7;
  `;
    return next();
  },
  queryHandler
);

app.get(
  "/poi",
  limiter,
  (req, res, next) => {
    req.sqlQuery = `
    SELECT *
    FROM public.poi;
  `;
    return next();
  },
  queryHandler
);

app.get(
  "/poi/details",
  limiter,
  (req, res, next) => {
    req.sqlQuery = `
    SELECT poi.name, poi.lat, poi.lon, phs.date,
    SUM(phe.events) AS events,
    SUM(phs.impressions) AS impressions,
    SUM(phs.clicks) AS clicks,
    ROUND(SUM(phs.revenue), 2) AS revenue
    FROM public.poi poi 
INNER JOIN public.hourly_stats phs 
 ON poi.poi_id = phs.poi_id 
 INNER JOIN public.hourly_events phe
 ON poi.poi_id = phe.poi_id
 GROUP BY poi.name, poi.lat, poi.lon, phs.date
 ORDER BY phs.date
 LIMIT 20 
  `;
    return next();
  },
  queryHandler
);

app.listen(process.env.PORT || 5555, err => {
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    console.log(`Running on ${process.env.PORT || 5555}`);
  }
});

// last resorts
process.on("uncaughtException", err => {
  console.log(`Caught exception: ${err}`);
  process.exit(1);
});
process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
  process.exit(1);
});

module.exports = app;
