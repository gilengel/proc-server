use crate::models::page::Page;
use rocket::response::status::BadRequest;
use rocket::serde::json::Json;

#[cfg(not(test))]
static BACKEND_URL: &str = "TODO_BACKEND_HERE";

extern crate reqwest;

type Pages = Vec<Page>;

async fn get_all() -> Result<Pages, reqwest::Error> {
    #[cfg(not(test))]
    let host = BACKEND_URL;

    #[cfg(test)]
    let host = &mockito::server_url();

    let url = format!("{}/i_pages", host);
    let pages: Pages = reqwest::get(url).await?.json().await?;

    Ok(pages)
}

#[get("/pages/v1")]
pub async fn all() -> Result<Json<Pages>, BadRequest<String>> {
    match get_all().await {
        Ok(pages) => return Ok(Json(pages)),
        Err(_) => return Err(BadRequest(Some(String::from("error message")))),
    };
}

async fn add(page: Page) -> Result<Page, reqwest::Error> {
    #[cfg(not(test))]
    let host = BACKEND_URL;

    #[cfg(test)]
    let host = &mockito::server_url();

    let url = format!("{}/i_pages", host);
    let client = reqwest::Client::new();

    let page: Page = client.post(url).json(&page).send().await?.json().await?;
    Ok(page)
}

#[post("/pages/v1", data = "<page>", format = "json")]
pub async fn add_page(page: Json<Page>) -> Result<Json<Page>, BadRequest<String>> {
    match add(page.into_inner()).await {
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

    fn create_date() -> DateTime<Utc> {
        DateTime::parse_from_rfc3339("2021-10-02T15:00:00.05Z")
            .unwrap()
            .with_timezone(&Utc)
    }

    #[test]
    fn get_pages() {
        // Mocking backend call
        let _m = mock("GET", "/i_pages")
            .with_status(200)
            .with_header("content-type", "application/json")
            .with_body(
                r#"[
                    {
                        "page_id": "mia",
                        "created_at": "2021-10-02T15:00:00.05Z"
                    },
                    {
                        "page_id": "maya",
                        "created_at": "2021-10-02T15:00:00.05Z"
                    }
                ]"#,
            )
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

    #[test]
    fn add_page_failing_with_redirect() {
        let body = r#"
        {
            "page_id": "mia",
            "created_at": "2021-10-02T15:00:00.05Z"
        }
        "#;

        let _m = mock("POST", "/i_pages")
            .with_status(308)
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
