import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import SearchBar from "./SearchBar";
import GoogleMapService from "../services/GoogleMapService";
import MapController from "../controllers/MapController";
import SavedPlaceService from "../services/SavedPlaceService";
import SavedPlaces from "./SavedPlaces";
import SavePlaceModal from "./SavePlaceModal";
import SavedPlace from "../models/SavedPlace";
import UserLocation from "../models/UserLocation";
import { HiBars3, HiXMark, HiAdjustmentsHorizontal, HiBookmark } from "react-icons/hi2";
import "./SaveButton.css";

const containerStyle = {
    width: "100%",
    height: "100vh",
};

const DEFAULT_LOCATION = new UserLocation(6.9271, 79.8612);
const mapService = new GoogleMapService(import.meta.env.VITE_MAP_KEY);
const mapController = new MapController();
const savedPlaceService = new SavedPlaceService();
const libraries = mapService.getLibraries();

export default function GoogleMapComponent() {
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: mapService.getApiKey() || "",
        libraries,
    });

    const [currentLocation, setCurrentLocation] = useState(DEFAULT_LOCATION.getCoordinates());
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [savedPlaces, setSavedPlaces] = useState([]);
    const [saveMode, setSaveMode] = useState(false);
    const [modalLocation, setModalLocation] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [activeMarker, setActiveMarker] = useState(null);
    const [mapTypeId, setMapTypeId] = useState("roadmap");
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        async function loadInitialData() {
            try {
                const userLoc = await mapController.getCurrentUserLocation();
                if (userLoc) {
                    setCurrentLocation(userLoc.getCoordinates());
                }
            } catch (err) {
                console.warn("Could not retrieve user location, using default location:", err);
            }

            try {
                const placesFromDb = await savedPlaceService.getPlaces();
                if (Array.isArray(placesFromDb)) {
                    setSavedPlaces(placesFromDb);
                }
            } catch (err) {
                console.error("Could not fetch saved places from MongoDB backend:", err);
            }
        }
        loadInitialData();
    }, []);

    const toggleSaveMode = () => {
        setSaveMode((prev) => !prev);
    };

    const handleMapDoubleClick = (event) => {
        if (!saveMode) return;
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setModalLocation({ lat, lng });
        setShowModal(true);
    };

    const handleSaveModalSubmit = async ({ name, category, listName, image, notes, lat, lng }) => {
        try {
            const savedData = await savedPlaceService.addPlace({
                name,
                category,
                listName,
                notes,
                image,
                lat,
                lng
            });
            setSavedPlaces((prev) => [savedData, ...prev]);
            setShowModal(false);
            setSaveMode(false);
            setModalLocation(null);
            setActiveMarker(savedData);
        } catch (err) {
            alert("Failed to save place to MongoDB backend server. Make sure server is running.");
        }
    };

    const handleDeleteSavedPlace = async (id) => {
        try {
            await savedPlaceService.deletePlace(id);
            setSavedPlaces((prev) => prev.filter((place) => place.id !== id));
            if (activeMarker && activeMarker.id === id) {
                setActiveMarker(null);
            }
        } catch (err) {
            alert("Failed to delete place from MongoDB database.");
        }
    };

    const handleSelectSavedPlace = (place) => {
        setCurrentLocation({ lat: place.latitude || place.lat, lng: place.longitude || place.lng });
        setActiveMarker(place);
    };

    const handlePlaceSelectedFromSearch = (place) => {
        const placeLat = place.latitude !== undefined ? place.latitude : place.lat;
        const placeLng = place.longitude !== undefined ? place.longitude : place.lng;
        if (placeLat !== undefined && placeLng !== undefined) {
            setCurrentLocation({ lat: placeLat, lng: placeLng });
        }
        setSelectedPlace(place);
        setActiveMarker(place);
    };

    if (loadError) {
        return <div style={{ padding: "20px", color: "#ef4444" }}>Error loading Google Maps API.</div>;
    }

    if (!isLoaded) {
        return <div style={{ padding: "20px" }}>Loading Map...</div>;
    }

    const mapCenter = selectedPlace
        ? { lat: selectedPlace.latitude || selectedPlace.lat, lng: selectedPlace.longitude || selectedPlace.lng }
        : currentLocation;

    return (
        <div style={{ position: "relative", width: "100%", height: "100vh" }}>
            {/* Top Navigation Bar */}
            <div className="top-nav-bar">
                <button
                    className="menu-toggle-btn"
                    onClick={() => setShowMenu(!showMenu)}
                    title="Menu"
                >
                    {showMenu ? <HiXMark /> : <HiBars3 />}
                </button>
                <div className="app-brand-title">🌐 Map Explorer</div>
            </div>

            {/* Slideout Side Menu */}
            {showMenu && (
                <div className="side-menu-drawer">
                    <div className="menu-header">
                        <h3>Map Controls</h3>
                        <p>Customize your viewing experience</p>
                    </div>

                    <div className="menu-section">
                        <div className="menu-section-title">
                            <HiAdjustmentsHorizontal className="section-icon" /> Map View Type
                        </div>
                        <div className="map-type-buttons">
                            <button
                                className={`type-btn ${mapTypeId === "roadmap" ? "active" : ""}`}
                                onClick={() => setMapTypeId("roadmap")}
                            >
                                🗺️ Standard Map
                            </button>
                            <button
                                className={`type-btn ${mapTypeId === "satellite" ? "active" : ""}`}
                                onClick={() => setMapTypeId("satellite")}
                            >
                                🛰️ Satellite View
                            </button>
                            <button
                                className={`type-btn ${mapTypeId === "hybrid" ? "active" : ""}`}
                                onClick={() => setMapTypeId("hybrid")}
                            >
                                🏔️ Hybrid View
                            </button>
                            <button
                                className={`type-btn ${mapTypeId === "terrain" ? "active" : ""}`}
                                onClick={() => setMapTypeId("terrain")}
                            >
                                ⛰️ Terrain View
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Search Bar (Top Center Aligned) */}
            <SearchBar onPlaceSelected={handlePlaceSelectedFromSearch} savedPlaces={savedPlaces} />

            {/* Save Place Mode Button (Top Right Aligned) */}
            <button
                className={`save-button ${saveMode ? "active" : ""}`}
                onClick={toggleSaveMode}
            >
                {saveMode ? "📍 Double-Click Map to Save" : "⭐ Save Place"}
            </button>

            {/* Banner guidance when saveMode is active */}
            {saveMode && (
                <div
                    style={{
                        position: "fixed",
                        top: "88px",
                        right: "30px",
                        zIndex: 1100,
                        background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                        color: "#ffffff",
                        padding: "10px 18px",
                        borderRadius: "20px",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        boxShadow: "0 8px 20px rgba(37, 99, 235, 0.35)",
                        animation: "pulse 2s infinite",
                    }}
                >
                    👆 Double-click any location on the map to open Save Box
                </div>
            )}

            {/* Saved Places Panel */}
            <SavedPlaces
                places={savedPlaces}
                onSelect={handleSelectSavedPlace}
                onDelete={handleDeleteSavedPlace}
                selectedPlaceId={activeMarker ? activeMarker.id : null}
            />

            {/* Google Map */}
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={14}
                mapTypeId={mapTypeId}
                onDblClick={handleMapDoubleClick}
                options={{
                    disableDoubleClickZoom: saveMode,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false,
                    zoomControl: false,
                }}
            >
                {/* Current User Location Marker */}
                {currentLocation && (
                    <Marker
                        position={currentLocation}
                        title="Your Location"
                        icon={{
                            url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                        }}
                    />
                )}

                {/* Saved Places Markers */}
                {savedPlaces.map((place) => (
                    <Marker
                        key={place.id}
                        position={{ lat: place.latitude, lng: place.longitude }}
                        title={place.name}
                        onClick={() => setActiveMarker(place)}
                    />
                ))}

                {/* Search Result Marker */}
                {selectedPlace && (
                    <Marker
                        position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
                        title={selectedPlace.name}
                        onClick={() => setActiveMarker(selectedPlace)}
                    />
                )}

                {/* Info Window */}
                {activeMarker && (
                    <InfoWindow
                        position={{
                            lat: activeMarker.latitude || activeMarker.lat,
                            lng: activeMarker.longitude || activeMarker.lng,
                        }}
                        onCloseClick={() => setActiveMarker(null)}
                    >
                        <div style={{ padding: "6px", maxWidth: "220px" }}>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "4px" }}>
                                {activeMarker.category && (
                                    <span style={{ fontSize: "0.75rem", padding: "2px 6px", background: "#dbeafe", color: "#2563eb", borderRadius: "4px", fontWeight: "600" }}>
                                        {activeMarker.category}
                                    </span>
                                )}
                            </div>
                            <h4 style={{ margin: "0 0 6px 0", color: "#0f172a", fontSize: "0.95rem" }}>
                                {activeMarker.name}
                            </h4>
                            {activeMarker.image && (
                                <img
                                    src={activeMarker.image}
                                    alt={activeMarker.name}
                                    style={{
                                        width: "100%",
                                        maxHeight: "120px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                        marginBottom: "6px",
                                    }}
                                />
                            )}
                            {activeMarker.notes && (
                                <p style={{ margin: "0 0 6px 0", fontSize: "0.78rem", color: "#475569", fontStyle: "italic" }}>
                                    "{activeMarker.notes}"
                                </p>
                            )}
                            <p style={{ margin: 0, fontSize: "0.75rem", color: "#94a3b8" }}>
                                📍 {(activeMarker.latitude || activeMarker.lat).toFixed(4)}, {(activeMarker.longitude || activeMarker.lng).toFixed(4)}
                            </p>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>

            {/* Save Place Modal */}
            {showModal && modalLocation && (
                <SavePlaceModal
                    location={modalLocation}
                    onSave={handleSaveModalSubmit}
                    onClose={() => {
                        setShowModal(false);
                        setModalLocation(null);
                    }}
                />
            )}
        </div>
    );
}