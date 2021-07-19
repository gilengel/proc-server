use std::convert::TryInto;

use model::Page;
use rocket::fairing::AdHoc;
use rocket::http::Status;
use rocket::response::status::Created;
use rocket::response::{status::NoContent, Debug};
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
    let a: Result<usize, _> = db
        .run(move |conn| DbPage::create(&vec![clone.into()], conn))
        .await?
        .try_into();

    assert!(!a.is_err());

    Ok(Created::new("/").body(page))
}

#[get("/i_pages")]
async fn get_all(db: Db) -> Result<Json<Vec<DbPage>>, NoContent> {
    let db_result: Result<Vec<DbPage>, _> = db.run(move |conn| DbPage::read_all(conn)).await;

    match db_result {
        Ok(pages) => return Ok(Json(pages)),
        Err(_) => return Err(NoContent),
    };
}

#[get("/i_pages/<page_id>")]
async fn get_by_page_id(page_id: String, db: Db) -> Result<Json<DbPage>, NoContent> {
    let a: Result<DbPage, _> = db
        .run(move |conn| DbPage::read_by_page_id(page_id, conn))
        .await;

    match a {
        Ok(page) => return Ok(Json(page)),
        Err(_) => return Err(NoContent),
    };
}

#[delete("/i_pages/<page_id>")]
async fn delete_by_page_id(page_id: String, db: Db) -> Status {
    let a: Result<usize, _> = db
        .run(move |conn| DbPage::delete_by_page_id(page_id, conn))
        .await;

    match a {
        Ok(_) => return Status::Ok,
        Err(_) => return Status::BadRequest,
    };
}

pub fn stage() -> AdHoc {
    AdHoc::on_ignite("PageDB Stage", |rocket| async {
        rocket.attach(Db::fairing()).mount(
            "/",
            routes![add_page, get_all, get_by_page_id, delete_by_page_id],
        )
    })
}

#[cfg(test)]
mod test {
    use chrono::Utc;
    use diesel::pg::PgConnection;
    use diesel::prelude::*;
    use diesel::result::Error;
    use dotenv::dotenv;
    use model::Page;
    use rocket::{
        http::{ContentType, Status},
        local::blocking::Client,
    };
    use std::env;

    use crate::ignite;
    use crate::models::db_page::{pages, DbPage};

    fn setup_connection() -> PgConnection {
        dotenv().ok();

        let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
        PgConnection::establish(&database_url)
            .expect(&format!("Error connecting to {}", database_url))
    }

    #[test]
    #[serial]
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
            assert_eq!(saved_pages, 1);

            Ok(())
        });
    }

    #[test]
    #[serial]
    fn add_page_via_api_with_db_storage() {
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
    #[serial]
    fn get_all_pages() {
        let connection = setup_connection();

        let date = Utc::now().naive_utc();
        let page = vec![DbPage {
            page_pk: None,
            page_id: String::from("59411a76-827a-4896-83b7-eefa653fe456"),
            name: String::from("test_page"),
            created_at: date,
        }];

        assert_eq!(DbPage::create(&page, &connection).unwrap(), 1);

        let expected = vec![DbPage {
            page_pk: Some(5),
            page_id: String::from("59411a76-827a-4896-83b7-eefa653fe456"),
            name: String::from("test_page"),
            created_at: date,
        }];

        let value = DbPage::read_all(&connection).unwrap();

        assert_eq!(value[0].page_id, expected[0].page_id);
        assert_eq!(value[0].name, expected[0].name);
    }

    #[test]
    #[serial]
    fn get_pages_via_api() {
        let client = Client::tracked(ignite()).expect("valid rocket instance");
        let response = client.get("/i_pages").dispatch();
        assert_eq!(response.status(), Status::Ok);

        // TODO add proper test to validate that the actual result really matches the stored data
    }

    #[test]
    #[serial]
    fn get_page_by_id_via_api() {
        let connection = setup_connection();
        let expected = DbPage {
            page_pk: None,
            page_id: "9bbfa845-604c-4cd8-aca1-679c4b893f44".into(),
            created_at: Utc::now().naive_utc(),
            name: "Random Page".into(),
        };

        let rows_inserted = diesel::insert_into(pages::table)
            .values(expected.clone())
            .execute(&connection);

        assert_eq!(Ok(1), rows_inserted);

        let client = Client::tracked(ignite()).expect("valid rocket instance");
        let response = client
            .get("/i_pages/9bbfa845-604c-4cd8-aca1-679c4b893f44")
            .dispatch();
        assert_eq!(response.status(), Status::Ok);
        assert_eq!(response.content_type(), Some(ContentType::JSON));

        let value = response.into_json::<DbPage>().unwrap();
        assert_eq!(value.page_id, expected.page_id);
        assert_eq!(value.name, expected.name);

        let value = diesel::delete(
            pages::table.filter(pages::page_id.eq("9bbfa845-604c-4cd8-aca1-679c4b893f44")),
        )
        .execute(&connection);
        assert_eq!(value, Ok(1))
    }

    #[test]
    #[serial]
    fn delete_page_by_id_via_api() {
        let connection = setup_connection();
        let expected = DbPage {
            page_pk: None,
            page_id: "9bbfa845-604c-4cd8-aca1-679c4b893f44".into(),
            created_at: Utc::now().naive_utc(),
            name: "Random Page".into(),
        };

        let rows_inserted = diesel::insert_into(pages::table)
            .values(expected.clone())
            .execute(&connection);

        assert_eq!(Ok(1), rows_inserted);

        let client = Client::tracked(ignite()).expect("valid rocket instance");
        let response = client
            .delete("/i_pages/9bbfa845-604c-4cd8-aca1-679c4b893f44")
            .dispatch();
        assert_eq!(response.status(), Status::Ok);
    }
}
