//use chrono::NaiveDateTime;

use chrono::NaiveDateTime;
use diesel::{PgConnection, QueryResult, RunQueryDsl};
use rocket::serde::{Deserialize, Serialize};

table! {
  pages(page_pk) {
    page_pk -> Int4,
    page_id -> Text,
    name -> Text,
    created_at -> Timestamp,
    data -> Nullable<Jsonb>,
  }
}

#[derive(Debug, Clone, Deserialize, Serialize, Queryable, Insertable)]
#[serde(crate = "rocket::serde")]
#[table_name = "pages"]
pub struct DbPage {
    #[serde(skip_deserializing)]
    pub page_pk: Option<i32>,
    pub page_id: String,
    pub name: String,
    pub created_at: NaiveDateTime,
}

impl DbPage {
    pub fn create(values: &Vec<DbPage>, conn: &PgConnection) -> QueryResult<usize> {
        diesel::insert_into(pages::table)
            .values(values)
            .execute(conn)
    }
}
