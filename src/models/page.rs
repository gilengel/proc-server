use serde::Serialize;
use rocket::serde::Deserialize;

#[derive(Serialize)]
#[derive(Debug)]
#[derive(Deserialize)]
pub struct Page {

}
impl PartialEq for Page {
    fn eq(&self, _: &Self) -> bool {
        true
    }
}
impl Eq for Page {}