'use strict';
const low = require('lowdb');
const registry = low('./lib/tables/registry.json');
var defaults = { completed: [] };

module.exports = {
  init: () => {
    // If registry is empty, initialise it with defaults
    if (Object.keys(registry.getState()).length < Object.keys(defaults).length) {
      registry.defaults(defaults).value();
    }
  }
};
