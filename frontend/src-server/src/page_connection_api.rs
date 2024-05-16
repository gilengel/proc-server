use log::error;
use rocket_contrib::json::Json;
use serde::Serialize;

use crate::api::ApiError;
use crate::db;
use crate::page_connection::{PageConnection, NewPageConnection};

#[options("/page_connection")]
pub fn connections() {}

#[post("/page_connection", data = "<page>", format = "json")]
pub fn create_page_connection(
    page: Json<NewPageConnection>,
    connection: db::Connection,
) -> Result<Json<PageConnection>, ApiError> {
    PageConnection::create(page.into_inner(), &connection)
        .map(Json)
        .map_err(|err| {
            error!("Unable to create page - {}", err);
            ApiError::InternalServerError
        })
}

#[derive(Serialize)]
pub struct PageConnectionsResponse {
    content: Vec<PageConnection>,
}

#[get("/page_connection/<connection_pk>")]
pub fn read_page_connection(connection_pk: i32, connection: db::Connection) -> Result<Json<PageConnection>, ApiError> {
    match PageConnection::read(connection_pk, &connection) {
        Ok(Some(page_connection)) => Ok(Json(page_connection)),
        Ok(None) => Err(ApiError::NotFound),
        Err(err) => {
            error!("Unable to read page - {}", err);
            Err(ApiError::InternalServerError)
        }
    }
}
