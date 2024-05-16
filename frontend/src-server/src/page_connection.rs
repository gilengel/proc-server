use diesel::{self, QueryDsl};
use diesel::pg::PgConnection;
use serde::{Deserialize, Serialize};
use crate::{schema::single_page_connection};
use chrono::NaiveDateTime;
use diesel::RunQueryDsl;

#[derive(AsChangeset, Serialize, Deserialize, Queryable, Insertable, Identifiable)]
#[primary_key(connection_pk)]
#[table_name = "single_page_connection"]
pub struct PageConnection {
    pub connection_pk: i32,
    pub connection_id: String,
    pub created_at: NaiveDateTime,
    pub incoming_page: i32,
    pub outgoing_page: i32,
}

#[derive(AsChangeset, Serialize, Deserialize, Queryable, Insertable)]
#[table_name = "single_page_connection"]
pub struct NewPageConnection<'a>
{
    pub connection_id: &'a str,
    pub created_at: NaiveDateTime,
    pub incoming_page: i32,
    pub outgoing_page: i32,
}

impl PageConnection {

    pub fn create(page_connection: NewPageConnection, connection: &PgConnection) -> Result<PageConnection, String> {
      diesel::insert_into(single_page_connection::table)
            .values(&page_connection)
            .get_result(connection)
            .map_err(|err| err.to_string())
    }

    pub fn read_all(connection: &PgConnection) -> Result<Vec<PageConnection>, String> {
        single_page_connection::table
            .order(single_page_connection::connection_pk)
            .load::<PageConnection>(connection)
            .map_err(|err| err.to_string())
    }

    pub fn read(connection_pk: i32, connection: &PgConnection) -> Result<Option<PageConnection>, String> {
        match single_page_connection::table.find(connection_pk).first(connection) {
            Ok(page_connection) => Ok(Some(page_connection)),
            Err(diesel::result::Error::NotFound) => Ok(None),
            Err(err) => Err(err.to_string()),
        }
    }
}

/*/
#[cfg(test)]
mod tests {
  use super::*;

  mod db;

  #[test]
  fn create_valid_page() {

    use crate::page::{NewPage};
    use chrono::{NaiveDate, NaiveDateTime};
    let dt: NaiveDateTime = NaiveDate::from_ymd(2016, 7, 8).and_hms(9, 10, 11);

    db::connect();


    let page = NewPage {
     page_id: "",
     name: "",
     created_at: dt
    };
  }
}
*/
