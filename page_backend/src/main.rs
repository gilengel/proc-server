#[macro_use]
extern crate rocket;
#[macro_use]
extern crate rocket_sync_db_pools;
#[macro_use]
extern crate diesel;
#[macro_use]
extern crate diesel_migrations;

mod api;
mod models;

#[launch]
fn ignite() -> _ {
    rocket::build().attach(api::page::stage())
}
