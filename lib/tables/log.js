'use strict';

module.exports = function (item) {
  const low = require('lowdb');
  const registry = low('./lib/tables/registry.json');

  var exists = registry.get('completed').find({ id: item.filename }).value();
  if (!exists) {
    registry.get('completed').push({ id: item.filename, table: item.table, url: item.url }).value();
    return `Added ${item.filename} to registry.`;
  } else {
    return `${item.filename} exists, skipping.`;
  }
};
