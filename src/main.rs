#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;

mod external_api;
mod models;

#[get("/")]
fn hello() -> &'static str {
    "Hello, world!"
}

#[launch]
fn ignite() -> _ {
    rocket::build().mount("/", routes![hello, external_api::page::all])
}

#[cfg(test)]
mod tests;
