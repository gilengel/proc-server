use chrono::NaiveDateTime;
use rocket::serde::{Deserialize, Serialize};

use diesel::prelude::*;

use crate::schema::pages;

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(crate = "rocket::serde")]
#[derive(Queryable, Selectable, AsChangeset)]
#[diesel(table_name = crate::schema::pages)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct DbPage {
    pub page_pk: i32,
    pub page_id: String,
    pub name: String,
    pub created_at: NaiveDateTime,
}

#[derive(Debug, Clone, Insertable, Deserialize, Serialize)]
#[diesel(table_name = crate::schema::pages)]
pub struct NewDbPage {
    pub page_id: String,
    pub name: String,
    pub created_at: NaiveDateTime,
}

#[derive(AsChangeset, Deserialize, Serialize)]
#[diesel(table_name = crate::schema::pages)]
pub struct ChangeDbPage {
    pub page_id: Option<String>,
    pub name: Option<String>,
}

impl PartialEq for DbPage {
    fn eq(&self, other: &Self) -> bool {
        self.page_id == other.page_id
            && self.created_at == other.created_at
            && self.name == other.name
            && self.page_pk == other.page_pk
    }
}
impl Eq for DbPage {}

// TODO for some reason tarpaulin creates missing lines with diesel eventhough these lines are definitely covered. Ignore them for now
impl DbPage {
    pub fn create(values: &Vec<NewDbPage>, conn: &mut PgConnection) -> DbPage {
        println!("{:?}", values);

        diesel::insert_into(pages::table)
            .values(values)
            .returning(DbPage::as_returning())
            .get_result(conn)
            .expect("Error saving new post")
    }

    pub fn read_all(conn: &mut PgConnection) -> QueryResult<Vec<DbPage>> {
        pages::table.select(DbPage::as_select()).load(conn)
    }

    pub fn read_by_page_id(page_id: String, connection: &mut PgConnection) -> QueryResult<DbPage> {
        use diesel::debug_query;

        let query = crate::schema::pages::table
            .select((
                crate::schema::pages::page_pk,
                crate::schema::pages::page_id,
                crate::schema::pages::name,
                crate::schema::pages::created_at,
            ))
            .filter(crate::schema::pages::page_id.eq(page_id));

        let debug = debug_query::<diesel::pg::Pg, _>(&query);
        println!("{:?}", debug);

        query.first(connection)
    }

    pub fn delete_by_page_id(page_id: String, connection: &mut PgConnection) -> QueryResult<usize> {
        diesel::delete(
            crate::schema::pages::table.filter(crate::schema::pages::page_id.eq(page_id)),
        )
        .execute(connection)
    }

    pub fn update_by_page_pk(
        page_pk: i32,
        page: &ChangeDbPage,
        connection: &mut PgConnection,
    ) -> QueryResult<usize> {
        diesel::update(
            crate::schema::pages::table.filter(crate::schema::pages::page_pk.eq(page_pk)),
        )
        .set(page)
        .execute(connection)
    }
}

#[cfg(test)]
mod tests {
    use super::DbPage;
    use chrono::{DateTime, Utc};
    use rand::Rng;

    #[test]
    fn db_pages_are_eq() {
        let mut rng = rand::thread_rng();

        let pk = rng.gen::<i32>();

        let utc: DateTime<Utc> = Utc::now();
        let uuid = String::from("8aa719b2-2800-40b4-b45f-0e5c0addd353");
        let value = DbPage {
            page_pk: pk,
            page_id: uuid.clone(),
            created_at: utc.naive_utc(),
            name: "Random Page".into(),
        };

        let expected = DbPage {
            page_pk: pk,
            page_id: uuid.clone(),
            created_at: utc.naive_utc(),
            name: "Random Page".into(),
        };

        assert!(value == expected);
    }

    #[test]
    fn db_pages_are_not_eq() {
        let mut rng = rand::thread_rng();

        let pk = rng.gen::<i32>();

        let utc: DateTime<Utc> = Utc::now();
        let value = DbPage {
            page_pk: pk,
            page_id: "8aa719b2-2800-40b4-b45f-0e5c0addd353".into(),
            created_at: utc.naive_utc(),
            name: "Random Page".into(),
        };

        let expected = DbPage {
            page_pk: pk,
            page_id: "XXXXXXXX-2800-40b4-b45f-0e5c0addd353".into(),
            created_at: utc.naive_utc(),
            name: "Random Page 2".into(),
        };

        assert!(value != expected);
    }
}
