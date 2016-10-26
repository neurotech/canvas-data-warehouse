'use strict';

// Compare the supplied array of filenames against the list of ids in the registry
module.exports = function (compare) {
  const low = require('lowdb');
  const registry = low('./lib/tables/registry.json');
  var completed = registry.get('completed').value();
  var difference = compare.filter((e1) => !completed.some((e2) => e2.id === e1.id));

  return difference;
};

// Thank you to Conrad Pankoff (https://github.com/deoxxa) for assistance with this.
