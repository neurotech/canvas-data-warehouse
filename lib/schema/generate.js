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

const _clean = function (raw) {
  var quotes = new RegExp(/'/g, "''");
  var newlines = new RegExp(/\n/g, ' ');
  var spaces = new RegExp(/\s{2}/g, ' ');
  return raw
    .replace(quotes)
    .replace(newlines)
    .replace(spaces);
};

const generate = function () {
  ddl.defaults(defaults).value();
  fetch(endpoint);
};

const fetch = function (uri) {
  got(uri, auth.got(uri))
    .then(response => { populate(response.body); })
    .catch(error => { return error; });
};

const populate = function (raw) {
  var schema = raw['schema'];
  _drops(schema);
  _creates(schema);
  _comments(schema);
};

const _drops = function (schema) {
  var operations = [];
  for (var item in schema) {
    operations.push(`DROP TABLE IF EXISTS ${schema[item]['tableName']};`);
  }
  ddl.set('drops', operations).value();
};

const _creates = function (schema) {
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
};

const _comments = function (schema) {
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
};

module.exports = generate;
