use rocket::serde::Deserialize;
use serde::Serialize;

#[derive(Serialize, Debug, Deserialize)]
pub struct Page {}
impl PartialEq for Page {
    fn eq(&self, _: &Self) -> bool {
        true
    }
}
impl Eq for Page {}
