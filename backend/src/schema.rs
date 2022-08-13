table! {
    pages (page_pk) {
        page_pk -> Int4,
        page_id -> Text,
        name -> Text,
        created_at -> Timestamp,
        data -> Nullable<Jsonb>,
    }
}
