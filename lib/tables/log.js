'use strict';

module.exports = function (item) {
  const low = require('lowdb');
  const registry = low('./lib/tables/registry.json');
  var exists = registry.get('completed').find({ id: item.id }).value();

  if (!exists) {
    registry.get('completed').push({ id: item.id, table: item.table, url: item.url }).value();
    return `Added ${item.id} to registry.\n`;
  } else {
    return `${item.id} exists, skipping.\n`;
  }
};
