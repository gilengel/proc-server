CREATE TABLE forms(
  form_pk int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  form_id uuid NOT NULL,
  name text NOT NULL,
  created_at timestamp NOT NULL,
  data json NOT NULL
);

CREATE TABLE layouts(
  layout_pk int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  layout_id text NOT NULL,
  name text NOT NULL,
  created_at timestamp NOT NULL,
  data jsonb NOT NULL
);

CREATE TABLE pages(
  page_pk int GENERATED ALWAYS AS IDENTITY,
  page_id text NOT NULL,
  name text NOT NULL,
  created_at timestamp NOT NULL,
  data jsonb NULL,

  CONSTRAINT page_pk PRIMARY KEY(page_pk)
);

CREATE TABLE temp_flow(
  flow_pk int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  flow_id text NOT NULL,
  name text NOT NULL,
  created_at timestamp NOT NULL,
  data jsonb NOT NULL
);

CREATE TABLE single_page_connection(
  connection_pk int GENERATED ALWAYS AS IDENTITY,
  connection_id text NOT NULL,
  created_at timestamp NOT NULL,
  incoming_page INT NOT NULL,
  outgoing_page INT NOT NULL,
  CONSTRAINT connection_pk PRIMARY KEY(connection_pk),
  CONSTRAINT incoming_page_fk FOREIGN KEY(incoming_page) REFERENCES pages(page_pk) MATCH FULL ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT outgoing_page_fk FOREIGN KEY(outgoing_page) REFERENCES pages(page_pk) MATCH FULL ON DELETE CASCADE ON UPDATE RESTRICT
);
