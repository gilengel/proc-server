use crate::models::page::Page;
use rocket::response::status::NotFound;
use rocket::serde::json::Json;

#[cfg(not(test))]
static BACKEND_URL: &str = "TODO_BACKEND_HERE";

extern crate reqwest;

type Pages = Vec<Page>;

#[get("/pages/v1")]
pub async fn all() -> Result<Json<Pages>, NotFound<String>> {
    #[cfg(not(test))]
    let host = BACKEND_URL;

    #[cfg(test)]
    let host = &mockito::server_url();

    let url = format!("{}/i_pages", host);
    let resp = reqwest::get(url).await.unwrap();

    if !resp.status().is_success() {
        return Err(NotFound(String::from("")));
    }

    let pages = resp.json::<Pages>().await.unwrap();
    Ok(Json(pages))
}

#[cfg(test)]
mod test {
    use crate::ignite;
    use mockito::mock;
    use rocket::http::Status;
    use rocket::local::blocking::Client;

    #[test]
    fn get_pages() {
        // Mocking backend call
        let _m = mock("GET", "/i_pages")
            .with_status(200)
            .with_header("content-type", "application/json")
            .with_header("x-api-key", "1234")
            .with_body("[{ \"page_id\": \"mia\"}, { \"page_id\": \"maya\"}]")
            .create();

        let client = Client::tracked(ignite()).expect("valid rocket instance");
        let response = client.get("/pages/v1").dispatch();
        assert_eq!(response.status(), Status::Ok);

        let value = response.into_json::<Vec<super::Page>>();
        let expected = Some(vec![
            super::Page {
                page_id: String::from("mia"),
            },
            super::Page {
                page_id: String::from("maya"),
            },
        ]);

        assert_eq!(value, expected);
    }
}
