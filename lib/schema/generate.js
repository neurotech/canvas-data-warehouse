'use strict';
/*
  Thanks to user 'wre0001@uah.edu' on the Canvas Community for the original
  version of this code (gen-ddl.js)
  https://community.canvaslms.com/thread/11081
*/

const got = require('got');
const low = require('lowdb');
const config = require('../../config');
const auth = require('../auth');

const ddl = low('./lib/schema/ddl.json');
var endpoint = config.get('api.url') + '/schema/latest';
var defaults = {
  drops: [],
  creates: [],
  comments: []
};

// Remove single quotes, new line characters, double spaces
const _clean = function (raw) {
  var quotes = /'/g;
  var newlines = /\n/g;
  var spaces = /\s{2}/g;
  return raw
    .replace(quotes, "''")
    .replace(newlines, ' ')
    .replace(spaces, ' ');
};

const generate = () => {
  // Seed ddl lowdb with defaults
  ddl.defaults(defaults).value();
  return new Promise((resolve, reject) => {
    // Get schema from Canvas Data API
    got(endpoint, auth.got(endpoint))
    .then(response => {
      var schema = response.body['schema'];
      // Generate DROP, CREATE, COMMENT SQL statements
      var ops = [ _drops(schema), _creates(schema), _comments(schema) ];
      Promise.all(ops).then(results => {
        resolve(results);
      });
    })
    .catch(error => {
      reject(error);
    });
  });
};

const _drops = schema => {
  return new Promise((resolve, reject) => {
    var operations = [];
    for (var item in schema) {
      operations.push(`DROP TABLE IF EXISTS ${schema[item]['tableName']};`);
    }
    ddl.set('drops', operations).value();
    resolve(`DROP TABLE statements: ${operations.length}`);
  });
};

const _creates = schema => {
  return new Promise((resolve, reject) => {
    var operations = [];
    for (var item in schema) {
      var table = schema[item]['tableName'];
      var columns = schema[item]['columns'];
      var fields = [];

      for (var i in columns) {
        var colname = columns[i]['name'];
        var coltype = columns[i]['type'];
        var colsize = columns[i]['length'];
        switch (coltype) {
          case 'guid':
          case 'enum':
            coltype = 'VARCHAR';
            colsize = '50';
            break;
          case 'datetime':
            coltype = 'TIMESTAMP';
            break;
          default:
            break;
        }
        var typeStr = coltype;
        if (colsize) { typeStr = `${coltype}(${colsize})`; }
        if (table === 'quiz_question_answer_dim' && coltype === 'varchar') { typeStr = 'text'; }
        if (colname === 'default') { colname = 'default_flag'; }
        fields.push(`${colname} ${typeStr.toUpperCase()}`);
      }

      var sql = `CREATE TABLE IF NOT EXISTS ${table} (${fields.join(', ')});`;
      operations.push(sql);
    }
    ddl.set('creates', operations).value();
    resolve(`CREATE TABLE statements: ${operations.length}`);
  });
};

const _comments = schema => {
  return new Promise((resolve, reject) => {
    var operations = [];
    for (var item in schema) {
      var table = schema[item]['tableName'];
      var description = schema[item]['description'];
      var columns = schema[item]['columns'];

      // Table comments
      if (description) {
        operations.push(`COMMENT ON TABLE ${table} IS '${_clean(description)}';`);
      }

      // Column comments
      for (var i in columns) {
        var colname = columns[i]['name'];
        var coldesc = columns[i]['description'];
        if (coldesc) {
          if (colname === 'default') {
            colname = 'default_flag';
          }
          operations.push(`COMMENT ON COLUMN ${table}.${colname} IS '${_clean(coldesc)}';`);
        }
      }
    }
    ddl.set('comments', operations).value();
    resolve(`COMMENT statements: ${operations.length}`);
  });
};

module.exports = generate;
