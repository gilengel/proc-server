use rocket::fairing::AdHoc;
use rocket::response::{status::Created, Debug};
use rocket::serde::json::Json;

use rocket_sync_db_pools::diesel;

use crate::models::db_page::DbPage;

#[database("diesel")]
struct Db(diesel::PgConnection);

type Result<T, E = Debug<diesel::result::Error>> = std::result::Result<T, E>;

#[post("/i_pages", data = "<page>", format = "json")]
async fn add_page(db: Db, page: Json<DbPage>) -> Result<Created<Json<DbPage>>> {
    let post_value = page.clone();
    db.run(move |conn| DbPage::create(&vec![post_value], conn))
        .await?;

    Ok(Created::new("/").body(page))
}

pub fn stage() -> AdHoc {
    AdHoc::on_ignite("PageDB Stage", |rocket| async {
        rocket.attach(Db::fairing()).mount("/", routes![add_page])
    })
}

#[cfg(test)]
mod test {
    use chrono::Utc;
    use diesel::pg::PgConnection;
    use diesel::prelude::*;
    use diesel::result::Error;
    use dotenv::dotenv;
    use rocket::http::{ContentType, Status};
    use std::env;

    use crate::models::db_page::DbPage;

    fn setup_connection() -> PgConnection {
        dotenv().ok();

        let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
        PgConnection::establish(&database_url)
            .expect(&format!("Error connecting to {}", database_url))
    }

    #[test]
    fn add_page_to_db() {
        let connection = setup_connection();

        connection.test_transaction::<_, Error, _>(|| {
            let pages = vec![DbPage {
                page_pk: None,
                page_id: String::from("59411a76-827a-4896-83b7-eefa653fe456"),
                name: String::from("test_page"),
                created_at: Utc::now().naive_utc(),
            }];

            let saved_pages = DbPage::create(&pages, &connection).unwrap();

            // Check that the returned user object has the correct values.
            assert_ne!(saved_pages, 0);

            Ok(())
        });
    }

    #[test]
    fn add_page_via_api() {
        let pages = vec![DbPage {
            page_pk: None,
            page_id: String::from("59411a76-827a-4896-83b7-eefa653fe456"),
            name: String::from("test_page"),
            created_at: Utc::now().naive_utc(),
        }];

        let client = Client::tracked(ignite()).expect("valid rocket instance");

        let date = DateTime::parse_from_rfc3339("2021-10-02T15:00:00.05Z")
            .unwrap()
            .with_timezone(&Utc);

        let response = client
            .post("/i_pages")
            .header(ContentType::JSON)
            .body(body)
            .dispatch();
        assert_eq!(response.status(), Status::Ok);

        let value = response.into_json::<super::Page>();
        let expected = Some(super::Page {
            page_id: String::from("mia"),
            created_at: date,
        });

        assert_eq!(value, expected);
    }
}
