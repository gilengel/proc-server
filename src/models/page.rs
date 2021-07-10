use rocket::serde::Deserialize;
use serde::Serialize;

#[derive(Serialize, Debug, Deserialize)]
pub struct Page {
    pub page_id: String,
}

impl PartialEq for Page {
    fn eq(&self, other: &Self) -> bool {
        self.page_id == other.page_id
    }
}
impl Eq for Page {}

#[test]
fn pages_are_eq() {
    let uuid = String::from("8aa719b2-2800-40b4-b45f-0e5c0addd353");
    let value = Page { page_id: uuid.clone() };
    let expected = Page { page_id: uuid.clone() };

    assert!(value == expected);
}

#[test]
fn pages_are_not_eq() {
    let value = Page { page_id: String::from("8aa719b2-2800-40b4-b45f-0e5c0addd353")};
    let expected = Page { page_id: String::from("24f1428a-53c6-4fa1-9bd0-e70c6fc2c9ce")};

    assert!(value != expected);
}