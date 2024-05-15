use chrono::NaiveDateTime;
use diesel::{AsChangeset, Insertable};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Insertable, Deserialize, Serialize)]
#[diesel(table_name = crate::schema::pages)]
pub struct NewDbPage {
    pub page_id: String,
    pub name: String,
    pub created_at: NaiveDateTime,
}

#[derive(AsChangeset, Deserialize, Serialize)]
#[diesel(table_name = crate::schema::pages)]
pub struct ChangeDbPage {
    pub page_id: Option<String>,
    pub name: Option<String>,
}
