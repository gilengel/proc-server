/*
use diesel;
use diesel::pg::PgConnection;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};

use crate::schema::users;

#[derive(AsChangeset, Serialize, Deserialize, Queryable, Insertable, Identifiable)]
#[primary_key(pk_id)]
pub struct User {
    pub pk_id: i32,
    pub name: String,
    pub address: String,
    pub email: String,
    pub birth_date: String,
}

//#[derive(Insertable, Deserialize)]
#[derive(AsChangeset, Serialize, Deserialize, Queryable, Insertable)]
#[table_name = "users"]
pub struct NewUser<'a> {
    //pub created_at: i64,
    pub name: &'a str,
    pub address: &'a str,
    pub email: &'a str,
    pub birth_date: &'a str,
}

impl User {
    pub fn create(user: NewUser, connection: &PgConnection) -> Result<User, String> {
        diesel::insert_into(users::table)
            .values(&user)
            .get_result(connection)
            .map_err(|err| err.to_string())

        /*
        diesel::insert_into(users::table)
            .values(&new_user)
            .get_result(connection)
            .expect("Error saving new post")

          let query = diesel::insert_into(users::table)
                .values(&user);

                //.map_err(|err| err.to_string())

            let debug = diesel::debug_query::<diesel::pg::Pg, _>(&query);
            println!("The insert query: {:?}", debug);

            query.get_result(connection).map_err(|err| err.to_string())
            */
    }

    pub fn read_all(connection: &PgConnection) -> Result<Vec<User>, String> {
        users::table
            .order(users::id)
            .load::<User>(connection)
            .map_err(|err| err.to_string())
    }

    pub fn read(id: i32, connection: &PgConnection) -> Result<Option<User>, String> {
        match users::table.find(id).first(connection) {
            Ok(user) => Ok(Some(user)),
            Err(diesel::result::Error::NotFound) => Ok(None),
            Err(err) => Err(err.to_string()),
        }
    }


    pub fn update(_: i32, user: User, connection: &PgConnection) -> Result<Option<User>, String> {
        let update_result = diesel::update(&user)
            .set(&user)
            .execute(connection);

        match update_result {
            Err(diesel::result::Error::NotFound) | Ok(0) => Ok(None),
            Err(err) => Err(err.to_string()),
            Ok(_) => Ok(Some(user)),
        }
    }

    pub fn delete(id: i32, connection: &PgConnection) -> Result<bool, String> {
        diesel::delete(users::table.find(id))
            .execute(connection)
            .map(|aff_rows| aff_rows > 0)
            .map_err(|err| err.to_string())
    }

}

*/
