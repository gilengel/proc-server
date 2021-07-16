#[macro_use]
extern crate rocket;
#[macro_use]
extern crate rocket_sync_db_pools;
#[macro_use]
extern crate diesel;

mod api;
mod models;

#[launch]
fn rocket() -> _ {
    rocket::build().attach(api::page::stage())
}
