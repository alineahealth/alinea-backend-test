-- Table creation script for the processing system
BEGIN;

ALTER TABLE beneficiaries ADD COLUMN IF NOT EXISTS holder_cpf VARCHAR(11);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_cpf ON beneficiaries (cpf);
-- Verify if the composite index is better than the single index
-- Think about the bulk insert/update performance
--CREATE INDEX IF NOT EXISTS idx_beneficiaries_company_deleted_cpf ON beneficiaries (deleted_at, company_id, cpf);
--CREATE INDEX IF NOT EXISTS idx_beneficiaries_company_deleted_accepted_cpf ON beneficiaries (deleted_at, company_id, accepted_terms_at, cpf);

CREATE TABLE IF NOT EXISTS processing_status (
  id SERIAL PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  description VARCHAR(256) NOT NULL
);

CREATE TABLE IF NOT EXISTS processings (
  id UUID PRIMARY KEY,
  bucket_name VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  processing_type VARCHAR(128) NOT NULL,
  file_extension VARCHAR(255) NOT NULL,
  competence_date DATE,
  processed_by VARCHAR(255),
  company_id INT,
  insurer_id INT,
  current_status VARCHAR(128) NOT NULL,
  total_rows INT NOT NULL,
  updated_rows INT,
  failed_rows INT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_process_company_id FOREIGN KEY (company_id) REFERENCES companies(id),
  CONSTRAINT fk_process_insurer_id FOREIGN KEY (insurer_id) REFERENCES insurers(id)
);

CREATE TABLE IF NOT EXISTS processing_history (
  id UUID PRIMARY KEY,
  process_id UUID NOT NULL,
  status_id int NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (process_id) REFERENCES processings(id),
  FOREIGN KEY (status_id) REFERENCES processing_status(id)
);

CREATE TABLE IF NOT EXISTS processed_rows (
  id UUID PRIMARY KEY,
  process_id UUID NOT NULL,
  raw_number INT,
  raw_content TEXT,
  row_type VARCHAR(64),
  update_reasons TEXT[],
  error_reasons TEXT[],
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (process_id) REFERENCES processings(id)
);

CREATE TABLE IF NOT EXISTS processing_schema_errors (
  id UUID PRIMARY KEY,
  process_id UUID NOT NULL,
  raw_content TEXT,
  error_reasons TEXT[],
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (process_id) REFERENCES processings(id)
);

-- Adding indexes for better performance
CREATE INDEX IF NOT EXISTS idx_process_company_id ON processings (company_id);
CREATE INDEX IF NOT EXISTS idx_process_insurer_id ON processings (insurer_id);
CREATE INDEX IF NOT EXISTS idx_processing_history_process_id ON processing_history (process_id);
CREATE INDEX IF NOT EXISTS idx_processed_rows_process_id ON processed_rows (process_id);
CREATE INDEX IF NOT EXISTS idx_processing_schema_errors_process_id ON processing_schema_errors (process_id);

CREATE INDEX IF NOT EXISTS idx_processings_created_at ON processings (created_at DESC);

COMMIT;
