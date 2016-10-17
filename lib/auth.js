'use strict';
const crypto = require('crypto');
const url = require('url');
const config = require('../config');

const auth = {};
const HMAC_ALG = 'sha256';

const _buildMessage = function (secret, timestamp, uri) {
  var urlInfo = url.parse(uri, false);
  var query = urlInfo.query ? urlInfo.query.split('&').sort().join('&') : '';
  var parts = [ 'GET', urlInfo.host, '', '', urlInfo.pathname, query, timestamp, secret ];
  return parts.join('\n');
};

const _sign = function (secret, timestamp, uri) {
  var message = _buildMessage(secret, timestamp, uri);
  var hmac = crypto.createHmac(HMAC_ALG, new Buffer(secret));
  hmac.update(message);
  return hmac.digest('base64');
};

auth.got = function (uri) {
  var today = new Date();
  var timestamp = today.toUTCString();
  var sign = _sign(config.api.secret, timestamp, uri);
  var options = {
    json: true,
    headers: {
      Authorization: `HMACAuth ${process.env.CD_API_KEY}:${sign}`,
      Date: timestamp
    }
  };
  return options;
};

module.exports = auth;
