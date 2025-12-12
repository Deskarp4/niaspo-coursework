CREATE TABLE IF NOT EXISTS objects (
  id SERIAL PRIMARY KEY,
  name TEXT
);

INSERT INTO objects (name) VALUES ('Object 1');
INSERT INTO objects (name) VALUES ('Object 2');
