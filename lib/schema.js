'use strict';
const got = require('got');
const auth = require('./auth');
const config = require('../config');
const uri = config.get('api.url') + '/schema/latest';

var schema = {};

schema.fetch = function () {
  return got(uri, auth.got(uri))
    .then(response => {
      return response.body;
    })
    .catch(error => {
      return error;
    });
};

schema.generate = function () {};

schema.execute = function () {};

module.exports = schema;
