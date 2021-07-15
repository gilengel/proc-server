use chrono::NaiveDateTime;

use crate::models::schema::pages;
use diesel::pg::PgConnection;
use diesel::RunQueryDsl;
use diesel::{self};
use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(AsChangeset, Serialize, Deserialize, Queryable, Insertable, Identifiable)]
#[primary_key(page_pk)]
#[table_name = "pages"]
pub struct DbPage {
    pub page_pk: i32,
    pub page_id: String,
    pub name: String,
    pub created_at: NaiveDateTime,
    pub data: Option<Value>,
}

#[derive(AsChangeset, Serialize, Deserialize, Queryable, Insertable)]
#[table_name = "pages"]
pub struct NewDbPage {
    pub page_id: String,
    pub name: String,
    pub created_at: NaiveDateTime,
}

impl DbPage {
    pub fn create(page: &Vec<NewDbPage>, connection: &PgConnection) -> Result<Vec<DbPage>, String> {
        diesel::insert_into(pages::table)
            .values(page)
            .get_results(connection)
            .map_err(|err| err.to_string())
    }
}
