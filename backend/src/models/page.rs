use chrono::{NaiveDateTime, DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Debug, Deserialize, Clone)]
pub struct Page {
    pub page_pk: Option<i32>,
    pub page_id: String,
    pub name: String,
    pub created_at: NaiveDateTime,
}

impl PartialEq for Page {
    fn eq(&self, other: &Self) -> bool {
        self.page_pk == other.page_pk
            && self.page_id == other.page_id
            && self.name == other.name
            && self.created_at == other.created_at
    }
}
impl Eq for Page {}

#[test]
fn pages_are_eq() {
    let utc = Utc::now().naive_utc();
    let uuid = String::from("8aa719b2-2800-40b4-b45f-0e5c0addd353");
    let value = Page {
        page_pk: None,
        page_id: uuid.clone(),
        name: "".into(),
        created_at: utc,
    };
    let expected = Page {
        page_pk: None,
        page_id: uuid.clone(),
        name: "".into(),
        created_at: utc,
    };

    assert!(value == expected);
}

#[test]
fn pages_are_not_eq() {
    let date = DateTime::parse_from_rfc3339("2021-12-19T16:39:57-08:00")
        .unwrap()
        .with_timezone(&Utc)
        .naive_utc();

    let value = Page {
        page_pk: None,
        page_id: String::from("8aa719b2-2800-40b4-b45f-0e5c0addd353"),
        name: "".into(),
        created_at: date,
    };
    let expected = Page {
        page_pk: None,
        page_id: String::from("24f1428a-53c6-4fa1-9bd0-e70c6fc2c9ce"),
        name: "".into(),
        created_at: date,
    };

    assert!(value != expected);
}
