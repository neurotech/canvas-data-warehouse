'use strict';

module.exports = function (items) {
  let transformed = [];
  items.forEach((item) => {
    transformed.push({ id: item.filename, table: item.table, url: item.url });
  });
  return transformed;
};
