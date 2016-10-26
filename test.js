'use strict';
const test = require('ava');
const config = require('./config');
const manifest = require('./lib/manifest');
const generate = require('./lib/schema/generate');

test('Valid config', t => {
  t.is(typeof config.get('api.url'), 'string', 'url OK');
  t.is(typeof config.get('api.key'), 'string', 'key OK');
  t.is(typeof config.get('api.secret'), 'string', 'secret OK');
  t.is(typeof config.get('db.host'), 'string', 'host OK');
  t.is(typeof config.get('db.port'), 'string', 'port OK');
  t.is(typeof config.get('db.user'), 'string', 'user OK');
  t.is(typeof config.get('db.password'), 'string', 'password OK');
});

test('GET /account/self/file/sync', async t => {
  const listing = await manifest.fetch();
  t.is(typeof listing, 'object');
});

test('Generate Schema', async t => {
  generate()
    .then(results => {
      t.is(typeof results, 'array');
    });
});
