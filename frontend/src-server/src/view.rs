/*
use serde::{Serialize, Deserialize};
use rocket_contrib::json::Json;
use std::error::Error;
use std::fs::File;
use std::path::Path;
use std::io::BufReader;

#[derive(Serialize, Deserialize, Debug)]
pub struct Widget {
    i: String,
    x: u16,
    y: u16,
    w: u16,
    h: u16,
    movable: bool,
    component: String
}

#[derive(Serialize, Deserialize, Debug)]
pub struct View {
    i: String,
    name: String,
    widgets: Vec<Widget>
}

pub fn read_view_from_file<P: AsRef<Path>>(path: P) -> Result<View, Box<dyn Error>> {
    let file = File::open(path)?;
    let reader = BufReader::new(file);

    let u = serde_json::from_reader(reader)?;

    Ok(u)
}

fn save_view_to_file<P: AsRef<Path>>(path: P, view: View) -> Result<bool, Box<dyn Error>> {
    let u = serde_json::to_writer(File::create(path)?, &view)?;

    Ok(true)
}

#[get("/view/load/<id>")]
pub fn single_view(id: usize) -> Option<Json<View>> {

    match read_view_from_file("./test_view.json") {
        Ok(v) => Some(Json(v)),
        Err(_) => None
    }

    /
        let uuid = Uuid::new_v4();

    Json(View {
        i: uuid.to_string(),
        name: "Candy Layout".to_string(),
        widgets: vec![
            Widget { i: Uuid::new_v4().to_string(), x: 0, y: 0, w: 6, h: 16, movable: false, component: "FlowGraphWidget".to_string() },
            Widget { i: Uuid::new_v4().to_string(), x: 6, y: 0, w: 6, h: 16, movable: true, component: "MapWidget".to_string() }
        ]
    })

}

#[options("/view/save")]
pub fn view() {}


#[post("/view/save", format = "application/json", data = "<view>")]
pub fn save_single_view(view: Json<View>)  {
    save_view_to_file(Path::new("./test_view.json"), view.into_inner());
}
*/
