#[cfg(test)]
mod test {
    use chrono::Utc;
    use diesel::pg::PgConnection;
    use diesel::prelude::*;
    use diesel::result::Error;
    use dotenv::dotenv;
    use std::env;

    use crate::models::db_page::{DbPage, NewDbPage};

    fn setup_connection() -> PgConnection {
        dotenv().ok();

        let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
        PgConnection::establish(&database_url)
            .expect(&format!("Error connecting to {}", database_url))
    }

    #[test]
    fn get_pages_from_db() {
        let connection = setup_connection();

        connection.test_transaction::<_, Error, _>(|| {
            let pages = vec![NewDbPage {
                page_id: String::from("59411a76-827a-4896-83b7-eefa653fe456"),
                name: String::from("test_page"),
                created_at: Utc::now().naive_utc(),
            }];

            let saved_pages = DbPage::create(&pages, &connection).unwrap();

            // Check that the returned user object has the correct values.
            assert_ne!(saved_pages.len(), 0);

            Ok(())
        });
    }
}
