#[macro_use]
extern crate rocket;
#[macro_use]
extern crate rocket_sync_db_pools;

mod api;
mod models;
pub mod schema;

use std::io::Cursor;

use rocket::{
    fairing::{Fairing, Info, Kind},
    http::{ContentType, Header, Method},
    Build, Request, Response, Rocket,
};

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

fn create_rocket() -> Rocket<Build> {
    openssl_probe::init_ssl_cert_env_vars();

    rocket::build()
        .mount("/", routes![hello])
        .attach(CORS())
        .attach(api::page::stage())
}

#[rocket::main]
async fn main() -> Result<(), rocket::Error> {
    println!("Hello rust backend :)");

    let _rocket = create_rocket().ignite().await?.launch().await?;

    Ok(())
}

#[cfg(test)]
pub(crate) mod test {
    use std::{env, panic};

    use diesel::{Connection, PgConnection};
    use dotenv::dotenv;

    pub(crate) fn setup_connection() -> PgConnection {
        dotenv().ok();
        let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
        println!("{}", database_url);
        PgConnection::establish(&database_url)
            .expect(&format!("Error connecting to {}", database_url))
    }

    pub(crate) fn run_test<T>(test: T) -> ()
    where
        T: FnOnce() -> () + panic::UnwindSafe,
    {
        let result = panic::catch_unwind(|| test());
        assert!(result.is_ok())
    }
}
