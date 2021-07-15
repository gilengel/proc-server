#[cfg(test)]
mod test {
    use diesel::pg::PgConnection;
    use diesel::prelude::*;
    use std::env;
    use std::panic;

    fn setup_connection() -> PgConnection {
        env::set_var("DATABASE_URL", "VALUE");

        let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
        PgConnection::establish(&database_url)
            .expect(&format!("Error connecting to {}", database_url))

            project("reset_drops_the_database")
            .folder("migrations")
            .build();            
    }

    //fn teardown() {}


    #[test]
    fn get_pages_from_db() {
        let connection = setup_connection();

        /*
        connection.test_transaction::<_, Error, _>(|| {
            // create_user() is the function under test, it creates a user in the database and
            // returns it.
            let user = create_user(&connection, email, password).unwrap();
    
            // Check that the returned user object has the correct values.
            assert_eq!(user.email, email);
            
            // Creating a second user with the same email address should result in an error.
            let second_user = create(&connection, email, "some_other_password").unwrap_err();
            match second_user {
                Err(DatabaseError(UniqueViolation, _)) => {},
                _ => panic!()
            }
    
            // Unfortunately at this point a database error has occurred and the transaction has
            // been closed so we cannot do any more database interactions. I have not yet found a
            // way around this. I simply open a new test transaction at this point.
    
            Ok(())
        });
        */
    }
}
