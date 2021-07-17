use model::Page;
use rocket::fairing::AdHoc;
use rocket::response::{status::Created, Debug};
use rocket::serde::json::Json;

use crate::models::db_page::DbPage;
use rocket_sync_db_pools::diesel;

#[database("diesel")]
struct Db(diesel::PgConnection);

type Result<T, E = Debug<diesel::result::Error>> = std::result::Result<T, E>;

impl From<Page> for DbPage {
    fn from(page: Page) -> Self {
        DbPage {
            page_pk: None,
            page_id: page.page_id,
            name: "".into(),
            created_at: page.created_at.naive_utc(),
        }
    }
}

#[post("/i_pages", data = "<page>", format = "json")]
async fn add_page(db: Db, page: Json<Page>) -> Result<Created<Json<Page>>> {
    let clone = page.clone();
    db.run(move |conn| DbPage::create(&vec![clone.into()], conn))
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
    use diesel_migrations::revert_latest_migration;
    use dotenv::dotenv;
    use model::Page;
    use rocket::{
        http::{ContentType, Status},
        local::blocking::Client,
    };
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
    fn add_page_via_api_without_db_storage() {
        let page = Page {
            page_id: String::from("59411a76-827a-4896-83b7-eefa653fe456"),
            created_at: Utc::now(),
        };

        let client =
            Client::tracked(rocket::build().attach(super::stage())).expect("valid rocket instance");

        let api_page_str = serde_json::to_string(&page).unwrap();

        let response = client
            .post("/i_pages")
            .header(ContentType::JSON)
            .body(api_page_str)
            .dispatch();
        assert_eq!(response.status(), Status::Created);

        let value = response.into_json::<Page>().unwrap();

        assert_eq!(value, page);
    }

    #[test]
    fn add_page_via_api_with_db_storage() {
        embed_migrations!();
        let connection = setup_connection();
        assert_ne!(embedded_migrations::run(&connection).is_err(), true);

        let page = Page {
            page_id: String::from("59411a76-827a-4896-83b7-eefa653fe456"),
            created_at: Utc::now(),
        };

        let client =
            Client::tracked(rocket::build().attach(super::stage())).expect("valid rocket instance");

        let api_page_str = serde_json::to_string(&page).unwrap();

        let response = client
            .post("/i_pages")
            .header(ContentType::JSON)
            .body(api_page_str)
            .dispatch();
        assert_eq!(response.status(), Status::Created);

        let value = response.into_json::<Page>().unwrap();

        assert_eq!(value, page);

        assert_ne!(revert_latest_migration(&connection).is_err(), true);
    }
}
