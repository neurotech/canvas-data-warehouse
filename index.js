'use strict';
const config = require('./config');
const generate = require('./lib/schema/generate');
const manifest = require('./lib/manifest');
const tables = require('./lib/tables');
const cleanup = require('./lib/cleanup');

function checkSetup () {
  cleanup();
  // Generate and execute DDL against the PostgreSQL database if `db.setup` flag is false
  if (typeof config.get('db.setup') === 'boolean' && config.get('db.setup') === false) {
    console.log('Database schema has not been setup! Beginning schema generation and execution.\n');
    // Generate DDL based on the Canvas Data API '/schema/latest' endpoint
    generate()
      .then(results => {
        console.log(`DDL generation complete.`);
        console.log(`${results.join(' | ')} \n`);
        // Execute DDL against the PostgreSQL database.
        const execute = require('./lib/schema/execute');
        execute();
        checkSeed();
      }, error => {
        console.error(error);
      });
  } else {
    console.log('Database schema has been setup - skipping.');
    checkSeed();
  }
}

function checkSeed () {
  // Seed PostgreSQL database if `db.seeded `flag is false
  if (typeof config.get('db.seeded') === 'boolean' && config.get('db.seeded') === false) {
    console.log(`Database has not been seeded! Beginning seed process.\n`);

    // Fetch the list of resources from the Canvas Data API endpoint /account/self/file/sync
    manifest.fetch()
      .then(results => {
        tables.init();
        const diff = require('./lib/tables/diff');
        const process = require('./lib/tables/process');
        const manifestItems = results['files'];
        const actions = diff(manifestItems);

        const series = function (table) {
          if (table) {
            process(table, function () {
              return series(actions.shift());
            });
          } else {
            config.set('db.seeded', true);
            console.log(`\nDatabase seeding completed.`);
            cleanup();
          }
        };
        series(actions.shift());
      }, error => {
        console.error(error);
      });
  } else {
    console.log('Database has been seeded - skipping.');
  }
}

checkSetup();
