class MapObject {

    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    displayInfo() {
        console.log(`ID: ${this.id}`);
        console.log(`Name: ${this.name}`);
    }

}

export default MapObject;