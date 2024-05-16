use log::error;
use rocket_contrib::json::Json;
use serde::Serialize;

use crate::api::ApiError;
use crate::db;
use crate::layout::{NewLayout, Layout};

#[options("/layouts")]
pub fn layouts() {}

#[post("/layouts", data = "<layout>", format = "json")]
pub fn create_layout(
    layout: Json<NewLayout>,
    connection: db::Connection,
) -> Result<Json<Layout>, ApiError> {
    Layout::create(layout.into_inner(), &connection)
        .map(Json)
        .map_err(|err| {
            error!("Unable to create layout - {}", err);
            ApiError::InternalServerError
        })
}

#[get("/layouts")]
pub fn read_layouts(connection: db::Connection) -> Result<Json<LayoutsResponse>, ApiError> {
    Layout::read_all(&connection)
        .map(|layouts| LayoutsResponse { content: layouts })
        .map(Json)
        .map_err(|err| {
            error!("Unable to read layouts - {}", err);
            ApiError::InternalServerError
        })
}

#[derive(Serialize)]
pub struct LayoutsResponse {
    content: Vec<Layout>,
}

#[get("/layouts/<layout_id>")]
pub fn read_layout(layout_id: i32, connection: db::Connection) -> Result<Json<Layout>, ApiError> {
    match Layout::read(layout_id, &connection) {
        Ok(Some(layout)) => Ok(Json(layout)),
        Ok(None) => Err(ApiError::NotFound),
        Err(err) => {
            error!("Unable to read layout - {}", err);
            Err(ApiError::InternalServerError)
        }
    }
}

/*
#[put("/users/<user_id>", data = "<user>", format = "json")]
pub fn update_user(
    user_id: i32,
    user: Json<User>,
    connection: db::Connection,
) -> Result<Json<User>, ApiError> {
    match User::update(user_id, user.into_inner(), &connection) {
        Ok(Some(user)) => Ok(Json(user)),
        Ok(None) => Err(ApiError::NotFound),
        Err(err) => {
            error!("Unable to update user - {}", err);
            Err(ApiError::InternalServerError)
        }
    }
}

#[delete("/users/<user_id>")]
pub fn delete_user(user_id: i32, connection: db::Connection) -> Result<(), ApiError> {
    match User::delete(user_id, &connection) {
        Ok(true) => Ok(()),
        Ok(false) => Err(ApiError::NotFound),
        Err(err) => {
            error!("Unable to delete user - {}", err);
            Err(ApiError::InternalServerError)
        }
    }
}
*/
