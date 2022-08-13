use chrono::NaiveDateTime;
use diesel::ExpressionMethods;
use diesel::{PgConnection, QueryDsl, QueryResult, RunQueryDsl};
use rocket::serde::{Deserialize, Serialize};
table! {
  pub pages(page_pk) {
    page_pk -> Nullable<Int4>,
    page_id -> Text,
    name -> Text,
    created_at -> Timestamp,
  }
}

#[derive(Debug, Clone, Deserialize, Serialize, Queryable, Insertable, AsChangeset)]
#[serde(crate = "rocket::serde")]
#[table_name = "pages"]
pub struct DbPage {
    pub page_pk: Option<i32>,
    pub page_id: String,
    pub name: String,
    pub created_at: NaiveDateTime,
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
    #[cfg(not(tarpaulin_include))]
    pub fn create(values: &Vec<DbPage>, conn: &PgConnection) -> QueryResult<usize> {
        println!("{:?}", values);
        
        diesel::insert_into(pages::table)
            .values(values)
            .execute(conn)
    }

    pub fn read_all(conn: &PgConnection) -> QueryResult<Vec<DbPage>> {
        pages::table.order(pages::page_pk).load::<DbPage>(conn)
    }

    #[cfg(not(tarpaulin_include))]
    pub fn read_by_page_id(page_id: String, connection: &PgConnection) -> QueryResult<DbPage> {
        use diesel::debug_query;

        let query = pages::table            
            .select((pages::page_pk, pages::page_id, pages::name, pages::created_at))
            .filter(pages::page_id.eq(page_id));
            

        let debug = debug_query::<diesel::pg::Pg, _>(&query);
        println!("{:?}", debug);
            

        query.first(connection)

    }

    #[cfg(not(tarpaulin_include))]
    pub fn delete_by_page_id(page_id: String, connection: &PgConnection) -> QueryResult<usize> {
        diesel::delete(pages::table.filter(pages::page_id.eq(page_id))).execute(connection)
    }

    #[cfg(not(tarpaulin_include))]
    pub fn update_by_page_pk(
        page_pk: i32,
        page: &DbPage,
        connection: &PgConnection,
    ) -> QueryResult<usize> {
        diesel::update(pages::table.filter(pages::page_pk.eq(page_pk)))
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
            page_pk: Some(pk),
            page_id: uuid.clone(),
            created_at: utc.naive_utc(),
            name: "Random Page".into(),
        };

        let expected = DbPage {
            page_pk: Some(pk),
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
            page_pk: Some(pk),
            page_id: "8aa719b2-2800-40b4-b45f-0e5c0addd353".into(),
            created_at: utc.naive_utc(),
            name: "Random Page".into(),
        };

        let expected = DbPage {
            page_pk: Some(pk),
            page_id: "XXXXXXXX-2800-40b4-b45f-0e5c0addd353".into(),
            created_at: utc.naive_utc(),
            name: "Random Page 2".into(),
        };

        assert!(value != expected);
    }
}
