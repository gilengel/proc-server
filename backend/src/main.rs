extern crate openssl;
#[macro_use]
extern crate rocket;
#[macro_use]
extern crate rocket_sync_db_pools;
#[macro_use]
extern crate diesel;

#[cfg(test)]
#[macro_use]
extern crate serial_test;

mod api;
mod models;


use std::io::Cursor;

use rocket::{Build, Request, Response, Rocket, fairing::{Fairing, Info, Kind}, http::{ContentType, Header, Method}};


#[get("/")]
fn hello() -> &'static str {
    "Page Backend Service is running"
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

fn create_rocket () -> Rocket<Build> {
    openssl_probe::init_ssl_cert_env_vars();

    let figment = rocket::Config::figment()
    .merge(("port", 8001));

    rocket::custom(figment)    
        .mount("/", routes![hello])
        .attach(CORS())
        .attach(api::page::stage())
}

#[rocket::main]
async fn main() -> Result<(), rocket::Error> {
    println!("Hello rust backend :)");

    create_rocket()
        .ignite().await?
        .launch().await
}

#[cfg(test)]
mod test {
    use super::create_rocket;
    use rocket::http::Status;
    use rocket::local::blocking::Client;

    #[test]
    fn hello_world() {
        let client = Client::tracked(create_rocket()).expect("valid rocket instance");
        let response = client.get("/").dispatch();
        assert_eq!(response.status(), Status::Ok);
        assert_eq!(
            response.into_string().unwrap(),
            "Page Backend Service is running"
        );
    }
}
