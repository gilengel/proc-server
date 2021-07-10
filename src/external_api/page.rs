use crate::models::page::Page;
use rocket::serde::json::Json;

#[get("/pages/v1")]
pub fn all() -> Json<Vec<Page>> {
    Json(vec![Page { page_id: String::from("") }, Page { page_id: String::from("") }])
}

#[cfg(test)]
mod test {
    use crate::ignite;
    use rocket::http::Status;
    use rocket::local::blocking::Client;

    #[test]
    fn hello_world() {
        let client = Client::tracked(ignite()).expect("valid rocket instance");
        let response = client.get("/pages/v1").dispatch();
        assert_eq!(response.status(), Status::Ok);

        let value = response.into_json::<Vec<super::Page>>();
        let expected = Some(vec![super::Page { page_id: String::from("") }, super::Page { page_id: String::from("") }]);

        assert_eq!(value, expected);
    }
}
