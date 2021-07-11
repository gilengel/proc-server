#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;

mod external_api;
mod models;

#[launch]
fn ignite() -> _ {
    rocket::build().mount(
        "/",
        routes![external_api::page::all, external_api::page::add_page],
    )
}
