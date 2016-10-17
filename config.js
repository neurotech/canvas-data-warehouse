'use strict';

module.exports = {
  api: {
    url: process.env.CD_API_URL,
    key: process.env.CD_API_KEY,
    secret: process.env.CD_API_SECRET
  },
  db: {
    host: process.env.CD_PG_HOST,
    port: parseInt(process.env.CD_PG_PORT, 8),
    user: process.env.CD_PG_USER,
    password: process.env.CD_PG_PASSWORD
  }
};
