'use strict';
const low = require('lowdb');
const pg = require('pg');
const config = require('../../config');
const ddl = low('./lib/schema/ddl.json');
const client = new pg.Client({
  host: config.get('db.host'),
  port: config.get('db.port'),
  user: config.get('db.user'),
  password: config.get('db.password'),
  database: 'postgres',
  application_name: 'canvas-data-warehouse'
});

const execute = function () {
  var drops = ddl.get('drops').value();
  var creates = ddl.get('creates').value();
  var comments = ddl.get('comments').value();
  var statements = drops.concat(creates, comments);

  client.connect(function (err) {
    if (err) throw err;
    console.log('Connected to Postgres. Executing DDL...');

    client.query(statements.join(' '), function (err, result) {
      if (err) throw err;
      console.log(`DDL execution complete. ${statements.length} statements executed.`);
      console.log(`Tables dropped: ${drops.length} | Tables created: ${creates.length} | Comments made: ${comments.length}`);
      client.end(function (err) {
        if (err) throw err;
        console.log('Disconnected from Postgres.');
      });
    });
  });
};

module.exports = execute;
