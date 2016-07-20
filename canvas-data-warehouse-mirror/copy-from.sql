-- Thanks to Lachlan Pitts for this:
CREATE TABLE sample_import (
  id bigint,
  canvas_id bigint,
  root_account_id bigint,
  account_id bigint,
  name varchar,
  base_role_type varchar,
  workflow_state varchar,
  created_at timestamp,
  updated_at timestamp,
  deleted_at timestamp
);

SET DATESTYLE ='ISO';

COPY sample_import FROM '/path/to/sample_txt.txt'
WITH
  DELIMITER E'\t'
  NULL AS E'\N'
  CSV
  HEADER;

SELECT * FROM sample_import;
