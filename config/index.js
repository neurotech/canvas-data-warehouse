'use strict';
const low = require('lowdb');
const store = low('./config/db.json');
var config = {};

var defaults = {
  api: {
    url: process.env.CD_API_URL,
    key: process.env.CD_API_KEY,
    secret: process.env.CD_API_SECRET
  },
  db: {
    host: process.env.CD_PG_HOST,
    port: parseInt(process.env.CD_PG_PORT, 8),
    user: process.env.CD_PG_USER,
    password: process.env.CD_PG_PASSWORD,
    setup: false,
    seeded: false
  }
};

config.init = function () {
  if (Object.keys(store.getState()).length < Object.keys(defaults).length) {
    store.defaults(defaults).value();
    console.log('Initialised config store.');
  } else {
    console.log('Config store exists! Skipping initialisation.');
  }
};

config.get = function (key) {
  return store.get(key).value();
};

config.set = function (key, value) {
  return store.set(key, value).value();
};

module.exports = config;
