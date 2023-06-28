BEGIN;

WITH new_records (name, description) AS (
  SELECT * FROM (
    VALUES 
      ('Started', 'Processing of the submitted file started'),
      ('Failed due schema errors', 'Failed due to schema errors'),
      ('Processing', 'File processing in progress'),
      ('Processed with success', 'File processed successfully'),
      ('Processed with errors', 'File processed with errors')
  ) AS nr (name, description)
)
INSERT INTO processing_status (name, description)
SELECT nr.name, nr.description
FROM new_records nr
WHERE NOT EXISTS (
  SELECT 1
  FROM processing_status ps
  WHERE ps.name = nr.name AND ps.description = nr.description
);

COMMIT;
