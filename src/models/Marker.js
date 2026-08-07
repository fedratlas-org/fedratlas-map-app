import MapObject  from "./MapObject.js";

class Marker extends MapObject {
    constructor(id, name, latitude, longitude) {
        super(id, name);

        this.latitude = latitude;
        this.longitude = longitude;
    }

    displayInfo() {

        console.log("------ Marker ------");
        console.log(`ID : ${this.id}`);
        console.log(`Name : ${this.name}`);
        console.log(`Latitude : ${this.latitude}`);
        console.log(`Longitude : ${this.longitude}`);

    }

}
export default Marker;