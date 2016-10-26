'use strict';
const fs = require('fs');
let path = './tmp/';

module.exports = function () {
  fs.readdir(path, (err, files) => {
    if (err) {
      throw err;
    } else if (files.length > 0) {
      files.forEach(function (filename) {
        fs.unlink(path + filename);
      });
      console.log(`Cleaned ./tmp | ${files.length} file(s) deleted.`);
    } else {
      console.log(`No files to clean.`);
    }
  });
};
