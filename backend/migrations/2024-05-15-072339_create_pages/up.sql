CREATE TABLE pages(
    page_pk int GENERATED ALWAYS AS IDENTITY,
    page_id text NOT NULL,
    name text NOT NULL,
    created_at timestamp NOT NULL,
    data jsonb NULL,
    CONSTRAINT page_pk PRIMARY KEY(page_pk)
);