-- Thanks to Lachlan Pitts for this:
-- CREATE TABLE sample_import (
--   id bigint,
--   canvas_id bigint,
--   root_account_id bigint,
--   account_id bigint,
--   name varchar,
--   base_role_type varchar,
--   workflow_state varchar,
--   created_at timestamp,
--   updated_at timestamp,
--   deleted_at timestamp
-- );
CREATE TABLE sample_import (
  id bigint,
  canvas_id bigint,
  name varchar,
  depth bigint,
  workflow_state varchar,
  parent_account varchar,
  parent_account_id bigint,
  grandparent_account varchar,
  grandparent_account_id bigint,
  root_account varchar,
  root_account_id bigint,
  subaccount1 varchar,
  subaccount1_id bigint,
  subaccount2 varchar,
  subaccount2_id bigint,
  subaccount3 varchar,
  subaccount3_id bigint,
  subaccount4 varchar,
  subaccount4_id bigint,
  subaccount5 varchar,
  subaccount5_id bigint,
  subaccount6 varchar,
  subaccount6_id bigint,
  subaccount7 varchar,
  subaccount7_id bigint,
  subaccount8 varchar,
  subaccount8_id bigint,
  subaccount9 varchar,
  subaccount9_id bigint,
  subaccount10 varchar,
  subaccount10_id bigint,
  subaccount11 varchar,
  subaccount11_id bigint,
  subaccount12 varchar,
  subaccount12_id bigint,
  subaccount13 varchar,
  subaccount13_id bigint,
  subaccount14 varchar,
  subaccount14_id bigint,
  subaccount15 varchar,
  subaccount15_id bigint,
  sis_source_id bigint
);

SET DATESTYLE ='ISO';

COPY sample_import FROM '/Users/timdouglas/canvas-data/canvas-data-cli/unpackedFiles/account_dim.txt' WITH DELIMITER E'\t' NULL AS '\N' CSV HEADER;

SELECT * FROM sample_import;
