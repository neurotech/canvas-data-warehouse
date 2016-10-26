'use strict';
const got = require('got');
const auth = require('../auth');
const config = require('../../config');
const uri = config.get('api.url') + '/account/self/file/sync';

var manifest = {};

manifest.fetch = function () {
  return got(uri, auth.got(uri))
    .then(response => {
      return response.body;
    })
    .catch(error => {
      return error;
    });
};

module.exports = manifest;
