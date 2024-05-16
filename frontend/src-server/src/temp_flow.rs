use serde_json::Value;

use crate::schema::temp_flow;
use chrono::NaiveDateTime;
use diesel::expression_methods::ExpressionMethods;
use diesel::pg::PgConnection;
use diesel::RunQueryDsl;
use diesel::{self, QueryDsl};
use serde::{Deserialize, Serialize};

#[derive(AsChangeset, Serialize, Deserialize, Queryable, Insertable, Identifiable)]
#[primary_key(flow_pk)]
#[table_name = "temp_flow"]
pub struct TempFlow {
    flow_pk: i32,
    flow_id: String,
    name: String,
    created_at: NaiveDateTime,
    data: Value,
}

#[derive(AsChangeset, Serialize, Deserialize, Queryable, Insertable)]
#[table_name = "temp_flow"]
pub struct NewTempFlow<'a> {
    pub flow_id: &'a str,
    pub name: &'a str,
    pub created_at: NaiveDateTime,
    pub data: Value,
}

impl TempFlow {
    pub fn create(temp_flow: NewTempFlow, connection: &PgConnection) -> Result<TempFlow, String> {
        diesel::insert_into(temp_flow::table)
            .values(&temp_flow)
            .get_result(connection)
            .map_err(|err| err.to_string())
    }

    pub fn read_all(connection: &PgConnection) -> Result<Vec<TempFlow>, String> {
        temp_flow::table
            .order(temp_flow::flow_pk)
            .load::<TempFlow>(connection)
            .map_err(|err| err.to_string())
    }

    pub fn read_by_flow_id(
        flow_id: String,
        connection: &PgConnection,
    ) -> Result<Option<TempFlow>, String> {
        match temp_flow::table
            .find(temp_flow::flow_pk)
            .filter(temp_flow::flow_id.eq_any(vec![flow_id]))
            .first(connection)
        {
            Ok(flow) => Ok(Some(flow)),
            Err(diesel::result::Error::NotFound) => Ok(None),
            Err(err) => Err(err.to_string()),
        }
    }

    pub fn update(_: i32, temp_flow: TempFlow, connection: &PgConnection) -> Result<Option<TempFlow>, String> {
        let update_result = diesel::update(&temp_flow).set(&temp_flow).execute(connection);

        match update_result {
            Err(diesel::result::Error::NotFound) | Ok(0) => Ok(None),
            Err(err) => Err(err.to_string()),
            Ok(_) => Ok(Some(temp_flow)),
        }
    }
}
