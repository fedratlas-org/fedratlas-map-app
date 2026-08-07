import LocationService from "../services/LocationService";
import UserLocation from "../models/UserLocation";

class MapController {

    constructor() {
        this.locationService = new LocationService();
    }

    async getCurrentUserLocation() {

        try {

            const location = await this.locationService.getCurrentLocation();

            return new UserLocation(
                location.latitude,
                location.longitude
            );

        } catch (error) {

            console.error(error);
            return null;

        }

    }

}

export default MapController;