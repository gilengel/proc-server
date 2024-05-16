use diesel::{self};
use diesel::pg::PgConnection;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use crate::schema::layouts;
use chrono::NaiveDateTime;

use serde_json::Value;

#[derive(AsChangeset, Serialize, Deserialize, Queryable, Insertable, Identifiable)]
#[primary_key(pk_id)]
#[table_name = "layouts"]
pub struct Layout {
    pub pk_id: i32,
    pub layout_id: String,
    pub name: String,
    pub created_at: NaiveDateTime,
    pub data: Value,
}

#[derive(AsChangeset, Serialize, Deserialize, Queryable, Insertable, Debug)]
#[table_name = "layouts"]
pub struct NewLayout
{
    pub name: String,
    pub created_at: NaiveDateTime,
    pub data: Value,
}

impl Layout {

    pub fn create(layout: NewLayout, connection: &PgConnection) -> Result<Layout, String> {
        diesel::insert_into(layouts::table)
            .values(&layout)
            .get_result(connection)
            .map_err(|err| err.to_string())
    }

    pub fn create_multiple(layouts: &Vec<NewLayout>, connection: &PgConnection) -> Result<Vec<Layout>, String> {
        diesel::insert_into(layouts::table)
            .values(layouts)
            .get_results(connection)
            .map_err(|err| err.to_string())
    }

    pub fn read_all(connection: &PgConnection) -> Result<Vec<Layout>, String> {
        layouts::table
            .order(layouts::pk_id)
            .load::<Layout>(connection)
            .map_err(|err| err.to_string())
    }

    pub fn read(pk_id: i32, connection: &PgConnection) -> Result<Option<Layout>, String> {
        match layouts::table.find(pk_id).first(connection) {
            Ok(layout) => Ok(Some(layout)),
            Err(diesel::result::Error::NotFound) => Ok(None),
            Err(err) => Err(err.to_string()),
        }
    }
    /*
    pub fn update(_: i32, user: User, connection: &PgConnection) -> Result<Option<User>, String> {
        let update_result = diesel::update(&user)
            .set(&user)
            .execute(connection);

        match update_result {
            Err(diesel::result::Error::NotFound) | Ok(0) => Ok(None),
            Err(err) => Err(err.to_string()),
            Ok(_) => Ok(Some(user)),
        }
    }

    pub fn delete(id: i32, connection: &PgConnection) -> Result<bool, String> {
        diesel::delete(users::table.find(id))
            .execute(connection)
            .map(|aff_rows| aff_rows > 0)
            .map_err(|err| err.to_string())
    }
    */
}
