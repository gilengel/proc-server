table! {
  temp_flow(flow_pk) {
    flow_pk -> Int4,
    flow_id -> Text,
    name -> Text,
    created_at -> Timestamp,
    data -> Jsonb,
  }
}

table! {
  pages(page_pk) {
    page_pk -> Int4,
    page_id -> Text,
    name -> Text,
    created_at -> Timestamp,
    data -> Nullable<Jsonb>,
  }
}

table! {
  single_page_connection(connection_pk) {
    connection_pk -> Int4,
    connection_id -> Text,
    created_at -> Timestamp,
    incoming_page -> Int4,
    outgoing_page -> Int4,
  }
}

table! {
    forms (id) {
        id -> Int4,
        form_id -> Text,
        name -> Text,
        created_at -> Timestamp,
        data -> Json,
    }
}

table! {
    layouts (pk_id) {
        pk_id -> Int4,
        layout_id -> Text,
        name -> Text,
        created_at -> Timestamp,
        data -> Jsonb,
    }
}

table! {
    users (id) {
        id -> Int4,
        created_at -> Nullable<Timestamp>,
        name -> Nullable<Text>,
        email -> Nullable<Text>,
        address -> Nullable<Text>,
        city -> Nullable<Text>,
        state -> Nullable<Text>,
        zip -> Nullable<Text>,
        birth_date -> Nullable<Text>,
        latitude -> Nullable<Float8>,
        longitude -> Nullable<Float8>,
        password -> Nullable<Text>,
        source -> Nullable<Text>,
    }
}


allow_tables_to_appear_in_same_query!(
    forms,
    layouts,
    users,
    pages
);
