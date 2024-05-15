use rocket::fairing::AdHoc;
use rocket::http::Status;
use rocket::response::status::Created;
use rocket::response::status::NoContent;
use rocket::serde::json::Json;

use rocket_sync_db_pools::diesel;

use crate::api_pages::db_entity::DbPage;
use crate::api_pages::dto::{ChangeDbPage, NewDbPage};
use crate::DatabaseResult;

use self::diesel::prelude::*;

#[options("/pages")]
pub fn options() {}

#[options("/pages/<_page_id>")]
pub fn pages_delete_options(_page_id: String) {}

#[post("/pages", data = "<page>", format = "json")]
async fn add_page(db: crate::Db, page: Json<NewDbPage>) -> DatabaseResult<Created<Json<DbPage>>> {
    let result = db
        .run(move |conn| {
            diesel::insert_into(crate::schema::pages::table)
                .values(page.0)
                .returning(DbPage::as_returning())
                .get_result(conn)
                .expect("Error saving new page")
        })
        .await;

    Ok(Created::new("/").body(Json(result)))
}

#[get("/pages")]
async fn get_all(db: crate::Db) -> Result<Json<Vec<DbPage>>, NoContent> {
    let db_result: Result<Vec<DbPage>, _> = db.run(move |conn| DbPage::read_all(conn)).await;
    let pages = db_result.unwrap();

    Ok(Json(pages))
}

#[get("/pages/<page_id>")]
async fn get_by_page_id(page_id: String, db: crate::Db) -> Result<Json<DbPage>, NoContent> {
    let db_result: Result<DbPage, _> = db
        .run(move |conn| DbPage::read_by_page_id(page_id, conn))
        .await;

    let db_result = match db_result {
        Ok(page) => Ok(Json(page)),
        Err(_) => Err(NoContent),
    };

    db_result
}

#[delete("/pages/<page_id>")]
async fn delete_by_page_id(page_id: String, db: crate::Db) -> Status {
    let db_result: Result<usize, _> = db
        .run(move |conn| DbPage::delete_by_page_id(page_id, conn))
        .await;

    let db_result = db_result.unwrap();

    match db_result {
        1 => Status::Ok,
        _ => Status::BadRequest,
    }
}

#[put("/pages/<page_pk>", data = "<page>", format = "json")]
async fn update_by_page_pk(page_pk: i32, page: Json<ChangeDbPage>, db: crate::Db) -> Status {
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
        rocket.attach(crate::Db::fairing()).mount(
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
    use crate::schema::pages;
    use chrono::Utc;
    use diesel::pg::PgConnection;
    use diesel::prelude::*;
    use rocket::{
        http::{ContentType, Status},
        local::blocking::Client,
    };
    use serial_test::serial;
    use std::fs;

    use crate::{
        api_pages::{self, db_entity::DbPage, dto::NewDbPage, entity::Page},
        create_rocket,
        test::{run_test, setup_connection},
    };

    fn create_test_db_page() -> NewDbPage {
        NewDbPage {
            page_id: "9bbfa845-604c-4cd8-aca1-679c4b893f44".into(),
            created_at: Utc::now().naive_utc(),
            name: "Random Page".into(),
        }
    }

    fn create_page_table(conn: &mut PgConnection) {
        let contents = fs::read_to_string("migrations/2024-05-15-072339_create_pages/up.sql");
        assert_eq!(contents.is_err(), false);
        let result = diesel::sql_query(contents.unwrap()).execute(conn);
        assert_eq!(result.is_err(), false);
    }

    fn delete_page_table(conn: &mut PgConnection) {
        let contents = fs::read_to_string("migrations/2024-05-15-072339_create_pages/down.sql");
        assert_eq!(contents.is_err(), false);
        let delete_from_db_result = diesel::sql_query(contents.unwrap()).execute(conn);
        assert_eq!(delete_from_db_result.is_err(), false);
    }

    #[test]
    #[serial]
    fn add_page_to_db() {
        run_test(|| {
            let mut connection = setup_connection();

            delete_page_table(&mut connection);
            create_page_table(&mut connection);

            let _pages = vec![create_test_db_page()];

            let result = DbPage::create(&_pages, &mut connection);
            let expected = "Random Page".to_owned();

            assert_eq!(result.name, expected);
        })
    }

    #[test]
    #[serial]
    fn add_page_via_api_with_db_storage() {
        run_test(|| {
            let mut connection = setup_connection();

            delete_page_table(&mut connection);
            create_page_table(&mut connection);

            let page = NewDbPage {
                page_id: String::from("59411a76-827a-4896-83b7-eefa653fe456"),
                name: "".into(),
                created_at: Utc::now().naive_utc(),
            };

            let client = Client::tracked(rocket::build().attach(super::stage()))
                .expect("valid rocket instance");

            let api_page_str = serde_json::to_string(&page).unwrap();

            let response = client
                .post("/pages")
                .header(ContentType::JSON)
                .body(api_page_str)
                .dispatch();
            assert_eq!(response.status(), Status::Created);

            let value = response.into_json::<Page>().unwrap();

            assert_eq!(value.name, page.name);
            assert_eq!(value.page_id, page.page_id);
        })
    }

    #[test]
    #[serial]
    fn get_all_pages() {
        run_test(|| {
            let mut connection = setup_connection();

            delete_page_table(&mut connection);
            create_page_table(&mut connection);

            let page = vec![create_test_db_page()];
            let result = DbPage::create(&page, &mut connection).name;
            let expected = "Random Page".to_owned();

            assert_eq!(result, expected);

            let value = DbPage::read_all(&mut connection).unwrap();

            assert_eq!(value.len(), 1);
            assert_eq!(value[0].page_id, page[0].page_id);
            assert_eq!(value[0].name, page[0].name);
        })
    }

    #[test]
    #[serial]
    fn get_pages_via_api() {
        run_test(|| {
            let mut connection = setup_connection();
            delete_page_table(&mut connection);
            create_page_table(&mut connection);

            let client = Client::tracked(create_rocket()).expect("valid rocket instance");
            let response = client.get("/pages").dispatch();
            assert_eq!(response.status(), Status::Ok);

            // TODO add proper test to validate that the actual result really matches the stored data
        })
    }

    #[test]
    #[serial]
    fn get_page_by_id_via_api() {
        run_test(|| {
            let mut connection = setup_connection();

            delete_page_table(&mut connection);
            create_page_table(&mut connection);

            let expected = create_test_db_page();

            let rows_inserted = diesel::insert_into(crate::schema::pages::table)
                .values(expected.clone())
                .execute(&mut connection);

            assert_eq!(Ok(1), rows_inserted);

            let _pages = DbPage::read_all(&mut connection).unwrap();
            for page in _pages.iter() {
                println!("{:?}", page);
            }

            let client = Client::tracked(create_rocket()).expect("valid rocket instance");
            let response = client
                .get("/pages/9bbfa845-604c-4cd8-aca1-679c4b893f44")
                .dispatch();
            assert_eq!(response.status(), Status::Ok);
            assert_eq!(response.content_type(), Some(ContentType::JSON));

            let value = response.into_json::<DbPage>().unwrap();
            assert_eq!(value.page_id, expected.page_id);
            assert_eq!(value.name, expected.name);

            let value = diesel::delete(
                pages::table.filter(pages::page_id.eq("9bbfa845-604c-4cd8-aca1-679c4b893f44")),
            )
            .execute(&mut connection);
            assert_eq!(value, Ok(1));
        })
    }

    #[test]
    #[serial]
    fn get_page_by_id_via_api_failing() {
        run_test(|| {
            let mut connection = setup_connection();

            delete_page_table(&mut connection);
            create_page_table(&mut connection);

            let pages = DbPage::read_all(&mut connection).unwrap();
            for page in pages.iter() {
                println!("{:?}", page);
            }

            let client = Client::tracked(create_rocket()).expect("valid rocket instance");
            let response = client
                .get("/pages/9bbfa845-604c-4cd8-aca1-679c4b893f44")
                .dispatch();
            assert_eq!(response.status(), Status::NoContent);
        })
    }

    #[test]
    #[serial]
    fn delete_page_by_id_via_api() {
        run_test(|| {
            let mut connection = setup_connection();

            delete_page_table(&mut connection);
            create_page_table(&mut connection);

            let rows_inserted = diesel::insert_into(pages::table)
                .values(create_test_db_page())
                .execute(&mut connection);

            assert_eq!(Ok(1), rows_inserted);

            let client = Client::tracked(create_rocket()).expect("valid rocket instance");
            let response = client
                .delete("/pages/9bbfa845-604c-4cd8-aca1-679c4b893f44")
                .dispatch();
            assert_eq!(response.status(), Status::Ok);
        })
    }

    #[test]
    #[serial]
    fn delete_page_by_id_via_api_failing() {
        run_test(|| {
            let mut connection = setup_connection();

            delete_page_table(&mut connection);
            create_page_table(&mut connection);

            let client = Client::tracked(create_rocket()).expect("valid rocket instance");
            let response = client
                .delete("/pages/9bbfa845-604c-4cd8-aca1-679c4b893f44")
                .dispatch();
            assert_eq!(response.status(), Status::BadRequest);
        })
    }

    #[test]
    #[serial]
    fn update_page_by_page_id() {
        run_test(|| {
            let mut connection = setup_connection();

            delete_page_table(&mut connection);
            create_page_table(&mut connection);

            let page: DbPage = diesel::insert_into(crate::schema::pages::table)
                .values(create_test_db_page())
                .returning(DbPage::as_returning())
                .get_result(&mut connection)
                .expect("Error saving new page");

            let new_page = NewDbPage {
                page_id: "9bbfa845-604c-4cd8-aca1-679c4b893f44".into(),
                created_at: Utc::now().naive_utc(),
                name: "Changed Page".into(),
            };

            let client = Client::tracked(create_rocket()).expect("valid rocket instance");
            let response = client
                .put(format!("/pages/{}", page.page_pk))
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
            let mut connection = setup_connection();

            delete_page_table(&mut connection);
            create_page_table(&mut connection);

            let new_page = NewDbPage {
                page_id: "9bbfa845-604c-4cd8-aca1-679c4b893f44".into(),
                created_at: Utc::now().naive_utc(),
                name: "Changed Page".into(),
            };

            let client = Client::tracked(create_rocket()).expect("valid rocket instance");
            let response = client
                .put("/pages/1")
                .header(ContentType::JSON)
                .json(&new_page)
                .dispatch();
            assert_eq!(response.status(), Status::BadRequest);
        });
    }
}
