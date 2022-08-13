use rocket::fairing::AdHoc;
use rocket::http::Status;
use rocket::response::status::Created;
use rocket::response::{status::NoContent, Debug};
use rocket::serde::json::Json;

use crate::models::db_page::{pages, DbPage};

use crate::models::page::Page;
use rocket_sync_db_pools::diesel;

use self::diesel::prelude::*;

#[database("diesel")]
struct Db(diesel::PgConnection);

type Result<T, E = Debug<diesel::result::Error>> = std::result::Result<T, E>;

impl From<Page> for DbPage {
    fn from(page: Page) -> Self {
        DbPage {
            page_pk: None,
            page_id: page.page_id,
            name: "".into(),
            created_at: page.created_at,
        }
    }
}

#[options("/i_pages")]
pub fn options() {}

#[options("/i_pages/<_page_id>")]
pub fn pages_delete_options(_page_id: String) {}

#[post("/i_pages", data = "<page>", format = "json")]
async fn add_page(db: Db, page: Json<DbPage>) -> Result<Created<Json<DbPage>>> {
    let post_value = page.clone();
    db.run(move |conn| {
        diesel::insert_into(pages::table)
            .values(&*post_value)
            .execute(conn)
    })
    .await?;

    Ok(Created::new("/").body(page))

    /*
    let clone = page.clone();
    let a: Result<usize, _> = db
        .run(move |conn| DbPage::create(&vec![clone.into()], conn))
        .await?
        .try_into();

    assert!(!a.is_err());

    Ok(Created::new("/").body(page))
    */
}

#[get("/i_pages")]
async fn get_all(db: Db) -> Result<Json<Vec<DbPage>>, NoContent> {
    let db_result: Result<Vec<DbPage>, _> = db.run(move |conn| DbPage::read_all(conn)).await;
    let pages = db_result.unwrap();

    Ok(Json(pages))
}

#[get("/i_pages/<page_id>")]
async fn get_by_page_id(page_id: String, db: Db) -> Result<Json<DbPage>, NoContent> {
    let db_result: Result<DbPage, _> = db
        .run(move |conn| DbPage::read_by_page_id(page_id, conn))
        .await;

    let db_result = match db_result {
        Ok(page) => Ok(Json(page)),
        Err(_) => Err(NoContent),
    };

    db_result
}

#[delete("/i_pages/<page_id>")]
async fn delete_by_page_id(page_id: String, db: Db) -> Status {
    let db_result: Result<usize, _> = db
        .run(move |conn| DbPage::delete_by_page_id(page_id, conn))
        .await;

    let db_result = db_result.unwrap();

    match db_result {
        1 => Status::Ok,
        _ => Status::BadRequest,
    }
}

#[put("/i_pages/<page_pk>", data = "<page>", format = "json")]
async fn update_by_page_pk(page_pk: i32, page: Json<DbPage>, db: Db) -> Status {
    let db_result: Result<usize, _> = db
        .run(move |conn| DbPage::update_by_page_pk(page_pk, &page.into_inner(), conn))
        .await;

    let db_result = db_result.unwrap();

    match db_result {
        1 => Status::Ok,
        _ => Status::BadRequest,
    }
}

pub fn stage() -> AdHoc {
    AdHoc::on_ignite("PageDB Stage", |rocket| async {
        rocket.attach(Db::fairing()).mount(
            "/",
            routes![
                options,
                pages_delete_options,
                add_page,
                get_all,
                get_by_page_id,
                delete_by_page_id,
                update_by_page_pk
            ],
        )
    })
}

#[cfg(test)]
mod test {
    use chrono::Utc;
    use diesel::pg::PgConnection;
    use diesel::prelude::*;
    use diesel::result::Error;
    use rocket::{
        http::{ContentType, Status},
        local::blocking::Client,
    };
    use std::fs;

    use crate::models::db_page::{pages, DbPage};
    use crate::{
        create_rocket,
        models::page::Page,
        test::{run_test, setup_connection},
    };

    fn create_test_db_page() -> DbPage {
        DbPage {
            page_pk: None,
            page_id: "9bbfa845-604c-4cd8-aca1-679c4b893f44".into(),
            created_at: Utc::now().naive_utc(),
            name: "Random Page".into(),
        }
    }

    fn create_page_table(conn: &PgConnection) {
        let contents = fs::read_to_string("migrations/2021-07-15-125948_create_pages/up.sql");
        assert_eq!(contents.is_err(), false);
        let result = diesel::sql_query(contents.unwrap()).execute(conn);
        assert_eq!(result.is_err(), false);
    }

    fn delete_page_table(conn: &PgConnection) {
        let contents = fs::read_to_string("migrations/2021-07-15-125948_create_pages/down.sql");
        assert_eq!(contents.is_err(), false);
        let delete_from_db_result = diesel::sql_query(contents.unwrap()).execute(conn);
        assert_eq!(delete_from_db_result.is_err(), false);
    }

    #[test]
    #[serial]
    fn add_page_to_db() {
        run_test(|| {
            let connection = setup_connection();

            delete_page_table(&connection);
            create_page_table(&connection);

            connection.test_transaction::<_, Error, _>(|| {
                let pages = vec![create_test_db_page()];

                let saved_pages = DbPage::create(&pages, &connection).unwrap();

                // Check that the returned user object has the correct values.
                assert_eq!(saved_pages, 1);

                Ok(())
            });
        })
    }

    #[test]
    #[serial]
    fn add_page_via_api_with_db_storage() {
        run_test(|| {
            let connection = setup_connection();

            delete_page_table(&connection);
            create_page_table(&connection);

            let page = Page {
                page_pk: None,
                page_id: String::from("59411a76-827a-4896-83b7-eefa653fe456"),
                name: "".into(),
                created_at: Utc::now().naive_utc(),
            };

            let client = Client::tracked(rocket::build().attach(super::stage()))
                .expect("valid rocket instance");

            let api_page_str = serde_json::to_string(&page).unwrap();

            let response = client
                .post("/i_pages")
                .header(ContentType::JSON)
                .body(api_page_str)
                .dispatch();
            assert_eq!(response.status(), Status::Created);

            let value = response.into_json::<Page>().unwrap();

            assert_eq!(value, page);
        })
    }

    #[test]
    #[serial]
    fn get_all_pages() {
        run_test(|| {
            let connection = setup_connection();

            create_page_table(&connection);

            let page = vec![create_test_db_page()];
            assert_eq!(DbPage::create(&page, &connection).unwrap(), 1);

            let value = DbPage::read_all(&connection).unwrap();

            assert_eq!(value.len(), 1);
            assert_eq!(value[0].page_id, page[0].page_id);
            assert_eq!(value[0].name, page[0].name);
        })
    }

    #[test]
    #[serial]
    fn get_pages_via_api() {
        run_test(|| {
            let connection = setup_connection();
            delete_page_table(&connection);
            create_page_table(&connection);

            let client = Client::tracked(create_rocket()).expect("valid rocket instance");
            let response = client.get("/i_pages").dispatch();
            assert_eq!(response.status(), Status::Ok);

            // TODO add proper test to validate that the actual result really matches the stored data
        })
    }

    #[test]
    #[serial]
    fn get_page_by_id_via_api() {
        run_test(|| {
            let connection = setup_connection();

            delete_page_table(&connection);
            create_page_table(&connection);

            let expected = create_test_db_page();

            let rows_inserted = diesel::insert_into(pages::table)
                .values(expected.clone())
                .execute(&connection);

            assert_eq!(Ok(1), rows_inserted);

            let pages = DbPage::read_all(&connection).unwrap();
            for page in pages.iter() {
                println!("{:?}", page);
            }

            let client = Client::tracked(create_rocket()).expect("valid rocket instance");
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
            assert_eq!(value, Ok(1));
        })
    }

    #[test]
    #[serial]
    fn get_page_by_id_via_api_failing() {
        run_test(|| {
            let connection = setup_connection();

            delete_page_table(&connection);
            create_page_table(&connection);

            let pages = DbPage::read_all(&connection).unwrap();
            for page in pages.iter() {
                println!("{:?}", page);
            }

            let client = Client::tracked(create_rocket()).expect("valid rocket instance");
            let response = client
                .get("/i_pages/9bbfa845-604c-4cd8-aca1-679c4b893f44")
                .dispatch();
            assert_eq!(response.status(), Status::NoContent);
        })
    }

    #[test]
    #[serial]
    fn delete_page_by_id_via_api() {
        run_test(|| {
            let connection = setup_connection();

            delete_page_table(&connection);
            create_page_table(&connection);

            let rows_inserted = diesel::insert_into(pages::table)
                .values(create_test_db_page())
                .execute(&connection);

            assert_eq!(Ok(1), rows_inserted);

            let client = Client::tracked(create_rocket()).expect("valid rocket instance");
            let response = client
                .delete("/i_pages/9bbfa845-604c-4cd8-aca1-679c4b893f44")
                .dispatch();
            assert_eq!(response.status(), Status::Ok);
        })
    }

    #[test]
    #[serial]
    fn delete_page_by_id_via_api_failing() {
        run_test(|| {
            let connection = setup_connection();

            delete_page_table(&connection);
            create_page_table(&connection);

            let client = Client::tracked(create_rocket()).expect("valid rocket instance");
            let response = client
                .delete("/i_pages/9bbfa845-604c-4cd8-aca1-679c4b893f44")
                .dispatch();
            assert_eq!(response.status(), Status::BadRequest);
        })
    }

    #[test]
    #[serial]
    fn update_page_by_page_id() {
        run_test(|| {
            let connection = setup_connection();

            delete_page_table(&connection);
            create_page_table(&connection);

            let rows_inserted = diesel::insert_into(pages::table)
                .values(create_test_db_page())
                .execute(&connection);

            assert_eq!(Ok(1), rows_inserted);

            let new_page = DbPage {
                page_pk: None,
                page_id: "9bbfa845-604c-4cd8-aca1-679c4b893f44".into(),
                created_at: Utc::now().naive_utc(),
                name: "Changed Page".into(),
            };

            let client = Client::tracked(create_rocket()).expect("valid rocket instance");
            let response = client
                .put("/i_pages/1")
                .header(ContentType::JSON)
                .json(&new_page)
                .dispatch();
            assert_eq!(response.status(), Status::Ok);
        });
    }

    #[test]
    #[serial]
    fn update_page_by_page_id_failing() {
        run_test(|| {
            let connection = setup_connection();

            delete_page_table(&connection);
            create_page_table(&connection);

            let new_page = DbPage {
                page_pk: None,
                page_id: "9bbfa845-604c-4cd8-aca1-679c4b893f44".into(),
                created_at: Utc::now().naive_utc(),
                name: "Changed Page".into(),
            };

            let client = Client::tracked(create_rocket()).expect("valid rocket instance");
            let response = client
                .put("/i_pages/1")
                .header(ContentType::JSON)
                .json(&new_page)
                .dispatch();
            assert_eq!(response.status(), Status::BadRequest);
        });
    }
}
