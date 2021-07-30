use crate::Redirect;
use model::Page;
use rocket::response::status::BadRequest;
use rocket::serde::json::Json;
use rocket::serde::uuid::Uuid;
use rocket::State;

extern crate reqwest;

type Pages = Vec<Page>;

#[get("/pages/v1")]
pub async fn all(redirect: &State<Redirect>) -> Result<Json<Pages>, BadRequest<String>> {
    let backend_call = async || -> Result<Pages, reqwest::Error> {
        let url = format!("{}/i_pages", redirect.backend_url);
        let pages: Pages = redirect.client.get(url).send().await?.json().await?;

        Ok(pages)
    };

    match backend_call().await {
        Ok(pages) => return Ok(Json(pages)),
        Err(_) => return Err(BadRequest(Some(String::from("error message")))),
    };
}

#[get("/pages/v1/single/latest/<page_id>")]
pub async fn latest(
    redirect: &State<Redirect>,
    page_id: Uuid,
) -> Result<Json<Page>, BadRequest<String>> {
    let backend_call = async || -> Result<Page, reqwest::Error> {
        let url = format!("{}/i_pages/latest/{}", redirect.backend_url, page_id);
        let page: Page = redirect.client.get(url).send().await?.json().await?;

        Ok(page)
    };

    match backend_call().await {
        Ok(page) => return Ok(Json(page)),
        Err(e) => {
            println!("{}", e);
            return Err(BadRequest(Some(String::from("error message"))));
        }
    };
}

#[post("/pages/v1", data = "<page>", format = "json")]
pub async fn add_page(
    redirect: &State<Redirect>,
    page: Json<Page>,
) -> Result<Json<Page>, BadRequest<String>> {
    let backend_call = async || -> Result<Page, reqwest::Error> {
        let url = format!("{}/i_pages", redirect.backend_url);
        let page: Page = redirect
            .client
            .post(url)
            .json(&page.into_inner())
            .send()
            .await?
            .json()
            .await?;
        Ok(page)
    };

    match backend_call().await {
        Ok(page) => return Ok(Json(page)),
        Err(_) => return Err(BadRequest(Some(String::from("error message")))),
    };
}

#[cfg(test)]
mod test {
    use crate::ignite;
    use chrono::{DateTime, Utc};
    use mockito::mock;
    use rocket::http::{ContentType, Status};
    use rocket::local::blocking::Client;
    use std::path::PathBuf;

    fn test_resource_dir<'a>(file_name: &'a str) -> PathBuf {
        let path: PathBuf = [env!("CARGO_MANIFEST_DIR"), "resources/test", file_name]
            .iter()
            .collect();

        path
    }

    fn create_date() -> DateTime<Utc> {
        DateTime::parse_from_rfc3339("2021-10-02T15:00:00.05Z")
            .unwrap()
            .with_timezone(&Utc)
    }

    #[test]
    fn get_pages_with_mock() {
        // Mocking backend call
        let _m = mock("GET", "/i_pages")
            .with_status(200)
            .with_header("content-type", "application/json")
            .with_body_from_file(test_resource_dir("array.json").as_path())
            .create();

        let client = Client::tracked(ignite()).expect("valid rocket instance");
        let response = client.get("/pages/v1").dispatch();
        assert_eq!(response.status(), Status::Ok);

        let date = create_date();
        let value = response.into_json::<Vec<super::Page>>();
        let expected = Some(vec![
            super::Page {
                page_id: String::from("mia"),
                created_at: date,
            },
            super::Page {
                page_id: String::from("maya"),
                created_at: date,
            },
        ]);

        assert_eq!(value, expected);
    }

    #[test]
    fn get_pages_failing() {
        let _m = mock("GET", "/i_pages")
            .with_status(200)
            .with_header("content-type", "application/json")
            .create();

        let client = Client::tracked(ignite()).expect("valid rocket instance");
        let response = client.get("/pages/v1").dispatch();
        assert_eq!(response.status(), Status::BadRequest);

        let value = response.into_json::<Vec<super::Page>>();
        assert_eq!(value, None);
    }

    #[test]
    fn get_latest_page() {
        let _m = mock(
            "GET",
            "/i_pages/latest/77bce157-1426-4906-8bea-4813259cf33c",
        )
        .with_status(200)
        .with_header("content-type", "application/json")
        .with_body_from_file(test_resource_dir("single.json").as_path())
        .create();

        let client = Client::tracked(ignite()).expect("valid rocket instance");
        let response = client
            .get("/pages/v1/single/latest/77bce157-1426-4906-8bea-4813259cf33c")
            .dispatch();
        assert_eq!(response.status(), Status::Ok);

        let date = create_date();
        let value = response.into_json::<super::Page>();
        let expected = Some(super::Page {
            page_id: String::from("77bce157-1426-4906-8bea-4813259cf33c"),
            created_at: date,
        });

        assert_eq!(value, expected);
    }

    #[test]
    fn get_latest_page_failing() {
        let _m = mock(
            "GET",
            "/i_pages/latest/77bce157-1426-4906-8bea-4813259cf33c",
        )
        .with_status(308)
        .with_header("content-type", "application/json")
        .with_body_from_file(test_resource_dir("invalid.json").as_path())
        .create();

        let client = Client::tracked(ignite()).expect("valid rocket instance");
        let response = client
            .get("/pages/v1/single/latest/77bce157-1426-4906-8bea-4813259cf33c")
            .dispatch();
        assert_eq!(response.status(), Status::BadRequest);
    }

    #[test]
    fn add_page() {
        let body = r#"
        {
            "page_id": "mia",
            "created_at": "2021-10-02T15:00:00.05Z"
        }
        "#;

        let _m = mock("POST", "/i_pages")
            .with_status(200)
            .with_header("content-type", "application/json")
            .with_body(body)
            .create();

        let client = Client::tracked(ignite()).expect("valid rocket instance");

        let date = DateTime::parse_from_rfc3339("2021-10-02T15:00:00.05Z")
            .unwrap()
            .with_timezone(&Utc);

        let response = client
            .post("/pages/v1")
            .header(ContentType::JSON)
            .body(body)
            .dispatch();
        assert_eq!(response.status(), Status::Ok);

        let value = response.into_json::<super::Page>();
        let expected = Some(super::Page {
            page_id: String::from("mia"),
            created_at: date,
        });

        assert_eq!(value, expected);
    }

    #[test]
    fn add_page_failing() {
        let body = r#"
        {
            "page_id": "mia",
            "created_at": "2021-10-02T15:00:00.05Z"
        }
        "#;

        let _m = mock("POST", "/i_pages")
            .with_status(500)
            .with_header("content-type", "application/json")
            .create();

        let client = Client::tracked(ignite()).expect("valid rocket instance");

        let response = client
            .post("/pages/v1")
            .header(ContentType::JSON)
            .body(body)
            .dispatch();
        assert_eq!(response.status(), Status::BadRequest);
    }
}
