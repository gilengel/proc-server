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

#[get("/")]
fn hello() -> &'static str {
    "Page Backend Service is running"
}

#[launch]
fn ignite() -> _ {
    rocket::build()
        .mount("/", routes![hello])
        .attach(api::page::stage())
}

#[cfg(test)]
mod test {
    use super::ignite;
    use rocket::http::Status;
    use rocket::local::blocking::Client;

    #[test]
    fn hello_world() {
        let client = Client::tracked(ignite()).expect("valid rocket instance");
        let response = client.get("/").dispatch();
        assert_eq!(response.status(), Status::Ok);
        assert_eq!(
            response.into_string().unwrap(),
            "Page Backend Service is running"
        );
    }
}
