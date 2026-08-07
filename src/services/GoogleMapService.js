class GoogleMapService {

    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    getApiKey() {
        return this.apiKey;
    }
    getLibraries() {
        return ["places"];
    }

    getDefaultCenter() {
        return {
            lat: 6.9271,
            lng: 79.8612
        };
    }

    getDefaultZoom() {
        return 12;
    }


}

export default GoogleMapService;