CREATE TYPE request_category AS ENUM ('IT', 'Facilities', 'Other');
CREATE TYPE request_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH');
CREATE TYPE request_status   AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

CREATE TABLE requests (
  id          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title       varchar(100)      NOT NULL,
  description text              NOT NULL,
  category    request_category  NOT NULL,
  priority    request_priority  NOT NULL,
  status      request_status    NOT NULL DEFAULT 'OPEN',
  created_at  timestamptz       NOT NULL DEFAULT now(),
  updated_at  timestamptz       NOT NULL DEFAULT now(),
  CONSTRAINT chk_title_length
    CHECK (char_length(btrim(title)) BETWEEN 3 AND 100),
  CONSTRAINT chk_description_length
    CHECK (char_length(description) BETWEEN 1 AND 1000)
);

CREATE INDEX idx_requests_status ON requests (status);
