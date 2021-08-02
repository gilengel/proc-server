#![feature(proc_macro_hygiene, decl_macro, async_closure)]

use rocket::{Request, Response, fairing::{Fairing, Info, Kind}, http::{ContentType, Header, Method}};
use std::io::Cursor;

#[macro_use]
extern crate rocket;

mod external_api;

pub struct Redirect {
    client: reqwest::Client,
    backend_url: String,
}

pub struct CORS();

#[rocket::async_trait]
impl Fairing for CORS {
    fn info(&self) -> Info {
        Info {
            name: "Add CORS headers to requests",
            kind: Kind::Response,
        }
    }

    async fn on_response<'r>(&self, request: &'r Request<'_>, response: &mut Response<'r>) {
        response.set_header(Header::new("Access-Control-Allow-Origin", "*"));
        response.set_header(Header::new(
            "Access-Control-Allow-Methods",
            "DELETE, PUT, POST, GET, PATCH, OPTIONS",
        ));
        response.set_header(Header::new("Access-Control-Allow-Headers", "*"));
        response.set_header(Header::new("Access-Control-Allow-Credentials", "true"));

        if request.method() == Method::Options {
            response.set_header(ContentType::Plain);

            let string = "";
            response.set_sized_body(string.len(), Cursor::new(string));
        }
    }
}

#[launch]
fn ignite() -> _ {
    #[cfg(not(test))]
    let host = "http://127.0.0.1:8001";

    #[cfg(test)]
    let host = &mockito::server_url();

    let figment = rocket::Config::figment()
        .merge(("port", 8000));

    rocket::custom(figment)    
        .manage(Redirect {
            client: reqwest::Client::new(),
            backend_url: String::from(host),
        })
        .attach(CORS())
        .mount(
            "/",
            routes![
                external_api::page::all,
                external_api::page::add_page,
                external_api::page::latest,
                external_api::page::options
            ],
        )
}
