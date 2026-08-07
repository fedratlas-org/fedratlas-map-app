import { Autocomplete } from "@react-google-maps/api";
import { useRef, useState } from "react";
import "./SearchBar.css";
import { IoSearch } from "react-icons/io5";
import { HiBookmark, HiXMark } from "react-icons/hi2";

export default function SearchBar({ onPlaceSelected, savedPlaces = [] }) {
    const autoCompleteRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const onLoad = (autocomplete) => {
        autoCompleteRef.current = autocomplete;
    };

    const onPlaceChanged = () => {
        const place = autoCompleteRef.current.getPlace();
        if (!place || !place.geometry) return;

        setSearchTerm(place.name || "");
        setIsFocused(false);
        onPlaceSelected({
            name: place.name,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
        });
    };

    const matchingSavedPlaces = searchTerm.trim()
        ? savedPlaces.filter((place) =>
            place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (place.category && place.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (place.notes && place.notes.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        : [];

    const handleSelectSaved = (place) => {
        setSearchTerm(place.name);
        setIsFocused(false);
        onPlaceSelected(place);
    };

    return (
        <div className="search-container">
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                <div className="search-box">
                    <span className="search-icon">
                        <IoSearch />
                    </span>
                    <input
                        type="text"
                        placeholder="Search destinations or saved places..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            className="clear-search-btn"
                            onClick={() => setSearchTerm("")}
                            title="Clear search"
                        >
                            <HiXMark />
                        </button>
                    )}
                </div>
            </Autocomplete>

            {/* Matching Saved Places Dropdown */}
            {isFocused && matchingSavedPlaces.length > 0 && (
                <div className="search-results-popover">
                    <div className="popover-header">
                        <HiBookmark className="popover-header-icon" />
                        <span>Saved Places ({matchingSavedPlaces.length})</span>
                    </div>
                    <div className="popover-list">
                        {matchingSavedPlaces.map((place) => (
                            <div
                                key={place.id || place._id}
                                className="popover-item"
                                onMouseDown={() => handleSelectSaved(place)}
                            >
                                <div className="popover-item-left">
                                    {place.image ? (
                                        <img src={place.image} alt={place.name} className="popover-thumb" />
                                    ) : (
                                        <div className="popover-badge-icon">
                                            {place.category ? place.category.split(" ")[0] : "📍"}
                                        </div>
                                    )}
                                </div>
                                <div className="popover-item-body">
                                    <div className="popover-item-name">{place.name}</div>
                                    <div className="popover-item-meta">
                                        <span className="popover-cat">{place.category || "General"}</span>
                                        {place.notes && (
                                            <span className="popover-notes">• {place.notes}</span>
                                        )}
                                    </div>
                                </div>
                                <span className="popover-star-badge">⭐ Saved</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}