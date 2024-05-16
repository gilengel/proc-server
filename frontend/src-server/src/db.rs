use diesel::pg::PgConnection;
use diesel::query_dsl::RunQueryDsl;
use diesel::r2d2::{ConnectionManager, Pool, PooledConnection};
use rocket::http::Status;
use rocket::request::{self, FromRequest};
use rocket::{Outcome, Request, State};
use std::env;
use std::ops::Deref;

pub type PgPool = Pool<ConnectionManager<PgConnection>>;

pub fn connect() -> PgPool {
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let manager = ConnectionManager::<PgConnection>::new(database_url);
    //let manager = ConnectionManager::<PgConnection>::new("postgres://diesel:diesel@localhost/test");
    Pool::new(manager).expect("Failed to create pool")
}

pub struct Connection(pub PooledConnection<ConnectionManager<PgConnection>>);

impl<'a, 'r> FromRequest<'a, 'r> for Connection {
    type Error = ();

    fn from_request(request: &'a Request<'r>) -> request::Outcome<Self, Self::Error> {
        let pool = request.guard::<State<PgPool>>()?;

        match pool.get() {
            Ok(conn) => diesel::sql_query(
                "SET SESSION CHARACTERISTICS AS TRANSACTION ISOLATION LEVEL SERIALIZABLE",
            )
            .execute(&conn)
            .map(|_| Outcome::Success(Connection(conn)))
            .unwrap_or(Outcome::Failure((Status::InternalServerError, ()))),

            Err(_) => Outcome::Failure((Status::ServiceUnavailable, ())),
        }
    }
}

impl Deref for Connection {
    type Target = PgConnection;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}
