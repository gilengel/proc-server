#![feature(proc_macro_hygiene, decl_macro, async_closure)]

#[macro_use]
extern crate rocket;

mod external_api;
mod models;

pub struct Redirect {
    client: reqwest::Client,
    backend_url: String,
}

#[launch]
fn ignite() -> _ {
    #[cfg(not(test))]
    let host = "TODO_BACKEND_HERE";

    #[cfg(test)]
    let host = &mockito::server_url();

    rocket::build()
        .manage(Redirect {
            client: reqwest::Client::new(),
            backend_url: String::from(host),
        })
        .mount(
            "/",
            routes![
                external_api::page::all,
                external_api::page::add_page,
                external_api::page::latest
            ],
        )
}
