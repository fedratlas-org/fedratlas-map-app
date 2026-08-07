import MapObject from "./MapObject";

class SavedPlace extends MapObject {
    constructor(id, name, latitude, longitude, image = "", category = "📍 General", notes = "") {
        super(id, name);
        this.latitude = latitude;
        this.longitude = longitude;
        this.image = image;
        this.category = category;
        this.notes = notes;
    }

    getLocation() {
        return {
            lat: this.latitude,
            lng: this.longitude
        };
    }
}

export default SavedPlace;