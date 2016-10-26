'use strict';
const fs = require('fs');
const zlib = require('zlib');
const got = require('got');
const pg = require('pg');
const copyFrom = require('pg-copy-streams').from;
const log = require('../tables/log');
const config = require('../../config');

let path = './tmp/';
const pool = new pg.Pool({
  host: config.get('db.host'),
  port: config.get('db.port'),
  user: config.get('db.user'),
  password: config.get('db.password'),
  database: 'postgres',
  application_name: 'canvas-data-warehouse',
  max: 10,
  idleTimeoutMillis: 10000
});

const process = function (resource, callback) {
  var fullPath = `${path}${resource.filename.replace('.gz', '.txt')}`;
  var extract = zlib.createGunzip();
  var txtFile = fs.createWriteStream(`${fullPath}`);

  got.stream(resource.url)
    .on('error', error => { console.log(error); })
    .pipe(extract)
    .pipe(txtFile);

  txtFile.on('finish', function () {
    console.log(`Downloaded and extracted ${resource.filename} to ${path}`);

    pool.connect(function (err, client, done) {
      if (err) { throw err; }
      console.log(`Copying records from ${resource.filename} to table: ${resource.table}`);
      var sql = `COPY ${resource.table} FROM STDIN WITH DELIMITER E\'\\t\' NULL AS \'\\N\' QUOTE E'\b' CSV HEADER`;
      var copyStream = client.query(copyFrom(sql));
      var fileStream = fs.createReadStream(fullPath);
      copyStream.on('error', (error) => {
        fs.writeFileSync('./errors.txt', JSON.stringify(error, null, ' '));
        console.error(error);
        done();
        callback();
      });
      copyStream.on('end', () => {
        console.log(log(resource));
        done();
        callback();
      });
      fileStream.pipe(copyStream);
    });
  });
};

module.exports = process;
