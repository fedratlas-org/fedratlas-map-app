class UserLocation {

    #latitude;
    #longitude;

    constructor(latitude, longitude) {
        this.setLatitude(latitude);
        this.setLongitude(longitude);
    }

    getLatitude() {
        return this.#latitude;
    }

    getLongitude() {
        return this.#longitude;
    }

    setLatitude(latitude) {

        if (latitude >= -90 && latitude <= 90) {
            this.#latitude = latitude;
        } else {
            throw new Error("Invalid Latitude");
        }

    }

    setLongitude(longitude) {

        if (longitude >= -180 && longitude <= 180) {
            this.#longitude = longitude;
        } else {
            throw new Error("Invalid Longitude");
        }

    }

    getCoordinates() {
        return {
            lat: this.#latitude,
            lng: this.#longitude
        };
    }

}

export default UserLocation;