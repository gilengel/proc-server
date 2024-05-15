// @generated automatically by Diesel CLI.

diesel::table! {
    forms (form_pk) {
        form_pk -> Int4,
        form_id -> Uuid,
        name -> Text,
        created_at -> Timestamp,
        data -> Json,
    }
}

diesel::table! {
    layouts (layout_pk) {
        layout_pk -> Int4,
        layout_id -> Text,
        name -> Text,
        created_at -> Timestamp,
        data -> Jsonb,
    }
}

diesel::table! {
    pages (page_pk) {
        page_pk -> Int4,
        page_id -> Text,
        name -> Text,
        created_at -> Timestamp,
        data -> Nullable<Jsonb>,
    }
}

diesel::table! {
    single_page_connection (connection_pk) {
        connection_pk -> Int4,
        connection_id -> Text,
        created_at -> Timestamp,
        incoming_page -> Int4,
        outgoing_page -> Int4,
    }
}

diesel::table! {
    spatial_ref_sys (srid) {
        srid -> Int4,
        #[max_length = 256]
        auth_name -> Nullable<Varchar>,
        auth_srid -> Nullable<Int4>,
        #[max_length = 2048]
        srtext -> Nullable<Varchar>,
        #[max_length = 2048]
        proj4text -> Nullable<Varchar>,
    }
}

diesel::table! {
    temp_flow (flow_pk) {
        flow_pk -> Int4,
        flow_id -> Text,
        name -> Text,
        created_at -> Timestamp,
        data -> Jsonb,
    }
}

diesel::allow_tables_to_appear_in_same_query!(
    forms,
    layouts,
    pages,
    single_page_connection,
    spatial_ref_sys,
    temp_flow,
);
