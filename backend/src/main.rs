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

    struct SplittedUrl {
        url_without_db_name: String,
        db_name: String,
    }

    fn split_db_name_from_url() -> SplittedUrl {
        let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");

        let last_seperator = database_url.rfind('/').unwrap();
        let (url_without_db_name, db_name) = database_url.split_at(last_seperator);

        SplittedUrl {
            url_without_db_name: url_without_db_name.into(),
            db_name: db_name[1..db_name.len()].into(),
        }
    }

    pub(crate) fn setup_connection() -> PgConnection {
        dotenv().ok();
        let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
        println!("{}", database_url);
        PgConnection::establish(&database_url)
            .expect(&format!("Error connecting to {}", database_url))
    }

    pub(crate) fn setup() {
        dotenv().ok();

        let db_url = split_db_name_from_url();

        let connection = PgConnection::establish(&db_url.url_without_db_name).unwrap();
        connection
            .execute(&format!(r#"CREATE DATABASE "{}""#, db_url.db_name))
            .expect(&format!("Creating database with name {}", db_url.db_name));
    }

    pub(crate) fn teardown() {
        let db_url = split_db_name_from_url();

        let conn = PgConnection::establish(&db_url.url_without_db_name).unwrap();
        conn.execute(&format!(r#"DROP DATABASE "{}""#, db_url.db_name))
            .unwrap();
    }

    pub(crate) fn run_test<T>(test: T) -> ()
    where
        T: FnOnce() -> () + panic::UnwindSafe,
    {
        setup();
        let result = panic::catch_unwind(|| test());
        teardown();
        assert!(result.is_ok())
    }

    /*
    #[test]
    fn hello_world() {
        run_test(|| {
            let client = Client::tracked(create_rocket()).expect("valid rocket instance");
            let response = client.get("/").dispatch();
            assert_eq!(response.status(), Status::Ok);
            assert_eq!(
                response.into_string().unwrap(),
                "Page Backend Service is running"
            );
        });
    }
    */
}
