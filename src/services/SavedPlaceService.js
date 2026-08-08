const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5000/api/places" : "/api/places");

class SavedPlaceService {
    async getPlaces() {
        try {
            const response = await fetch(API_BASE_URL);
            if (!response.ok) {
                throw new Error(`Failed to fetch saved places: ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("SavedPlaceService.getPlaces Error:", error);
            return [];
        }
    }

    async addPlace(placeData) {
        try {
            const response = await fetch(API_BASE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(placeData)
            });
            if (!response.ok) {
                throw new Error(`Failed to create saved place: ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("SavedPlaceService.addPlace Error:", error);
            throw error;
        }
    }

    async deletePlace(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: "DELETE"
            });
            if (!response.ok) {
                throw new Error(`Failed to delete saved place: ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("SavedPlaceService.deletePlace Error:", error);
            throw error;
        }
    }
}

export default SavedPlaceService;