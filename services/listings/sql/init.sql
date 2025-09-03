CREATE TABLE IF NOT EXISTS listings (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  owner_id INTEGER NOT NULL,
  tenant_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE listings ADD COLUMN IF NOT EXISTS document tsvector;

CREATE INDEX IF NOT EXISTS listings_document_idx ON listings USING GIN(document);

CREATE OR REPLACE FUNCTION listings_tsvector_trigger() RETURNS trigger AS $$
begin
  new.document := to_tsvector('english', coalesce(new.title,'') || ' ' || coalesce(new.description,''));
  return new;
end
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tsvectorupdate ON listings;
CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
  ON listings FOR EACH ROW EXECUTE PROCEDURE listings_tsvector_trigger();
