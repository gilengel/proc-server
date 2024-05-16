use crate::schema::pages;
use chrono::NaiveDateTime;
use diesel::pg::PgConnection;
use diesel::RunQueryDsl;
use diesel::{self, QueryDsl};
use diesel::expression_methods::ExpressionMethods;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use diesel::sql_types::Text;

#[derive(AsChangeset, Serialize, Deserialize, Queryable, Insertable, Identifiable)]
#[primary_key(page_pk)]
#[table_name = "pages"]
pub struct Page {
    pub page_pk: i32,
    pub page_id: String,
    pub name: String,
    pub created_at: NaiveDateTime,
    pub data: Option<Value>,
}

#[derive(AsChangeset, Serialize, Deserialize, Queryable, Insertable)]
#[table_name = "pages"]
pub struct NewPage<'a> {
    pub page_id: &'a str,
    pub name: &'a str,
    pub created_at: NaiveDateTime,
}
#[derive(QueryableByName, Serialize, Deserialize, Debug)]
pub struct PageConnectionIds {
    #[sql_type = "Text"]
    outgoing_id: String,
    #[sql_type = "Text"]
    incoming_id: String,
    #[sql_type = "Text"]
    outgoing_name: String,
    #[sql_type = "Text"]
    incoming_name: String,
}

impl Page {
    pub fn create(page: &Vec<NewPage>, connection: &PgConnection) -> Result<Vec<Page>, String> {
        diesel::insert_into(pages::table)
            .values(page)
            .get_results(connection)
            .map_err(|err| err.to_string())
    }

    pub fn read_all(connection: &PgConnection) -> Result<Vec<Page>, String> {
        pages::table
            .order(pages::page_pk)
            .load::<Page>(connection)
            .map_err(|err| err.to_string())
    }

    pub fn read(page_pk: i32, connection: &PgConnection) -> Result<Option<Page>, String> {
        match pages::table.find(page_pk).first(connection) {
            Ok(page) => Ok(Some(page)),
            Err(diesel::result::Error::NotFound) => Ok(None),
            Err(err) => Err(err.to_string()),
        }
    }

    pub fn read_by_page_id(
        page_id: String,
        connection: &PgConnection,
    ) -> Result<Option<Page>, String> {
        match pages::table
            .find(pages::page_pk)
            .filter(pages::page_id.eq_any(vec![page_id]))
            .first(connection)
        {
            Ok(page) => Ok(Some(page)),
            Err(diesel::result::Error::NotFound) => Ok(None),
            Err(err) => Err(err.to_string()),
        }
    }


    pub fn read_latest(page_id: String, connection: &PgConnection) -> Result<Option<Page>, String> {
        match pages::table
            .filter(pages::page_id.eq(page_id))
            .order(pages::created_at.desc())
            .first(connection)
        {
            Ok(page) => Ok(Some(page)),
            Err(diesel::result::Error::NotFound) => Ok(None),
            Err(err) => Err(err.to_string()),
        }
    }

    // TODO might be not needed anylonger
    pub fn extract_pk_for_connection(
        previous_uuid: String,
        next_uuid: String,
        connection: &PgConnection,
    ) -> Result<Vec<i32>, String> {
        pages::table
            .select(pages::page_pk)
            .filter(pages::page_id.eq_any(vec![previous_uuid, next_uuid]))
            .load::<i32>(&connection as &PgConnection)
            .map_err(|err| err.to_string())
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
    */
    pub fn delete(pk_id: i32, connection: &PgConnection) -> Result<bool, String> {
        diesel::delete(pages::table.find(pk_id))
            .execute(connection)
            .map(|aff_rows| aff_rows > 0)
            .map_err(|err| err.to_string())
    }

    pub fn read_following_page_ids(
        page_id: String,
        connection: &PgConnection,
    ) -> Result<Vec<PageConnectionIds>, String> {
        // TODO: 2021-04-05 Diesel does not currently supports aliases therefore we need to use a raw query for the time being since
        // we combine the same table (pages) twice in the query

        let query = format!("SELECT i.page_id AS incoming_id, i.name AS incoming_name, o.page_id AS outgoing_id, o.name AS outgoing_name FROM pages AS i, pages AS o, single_page_connection AS c WHERE i.page_pk = c.incoming_page AND o.page_pk = c.outgoing_page AND i.page_id = '{}'", page_id);

        diesel::sql_query(query).load::<PageConnectionIds>(connection)
        .map_err(|err| err.to_string())
    }

    pub fn read_previous_page_ids(
        page_id: String,
        connection: &PgConnection,
    ) -> Result<Vec<PageConnectionIds>, String> {
        // TODO: 2021-04-05 Diesel does not currently supports aliases therefore we need to use a raw query for the time being since
        // we combine the same table (pages) twice in the query

        let query = format!("SELECT i.page_id AS incoming_id, i.name AS incoming_name, o.page_id AS outgoing_id, o.name AS outgoing_name FROM pages AS i, pages AS o, single_page_connection AS c WHERE i.page_pk = c.incoming_page AND o.page_pk = c.outgoing_page AND o.page_id = '{}'", page_id);

        diesel::sql_query(query).load::<PageConnectionIds>(connection)
        .map_err(|err| err.to_string())
    }

    pub fn update(_: i32, page: Page, connection: &PgConnection) -> Result<Option<Page>, String> {
        let update_result = diesel::update(&page).set(&page).execute(connection);

        match update_result {
            Err(diesel::result::Error::NotFound) | Ok(0) => Ok(None),
            Err(err) => Err(err.to_string()),
            Ok(_) => Ok(Some(page)),
        }
    }
}
