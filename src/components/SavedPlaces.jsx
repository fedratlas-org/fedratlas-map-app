import React, { useState } from "react";
import "./SavedPlaces.css";

const CATEGORIES = ["All", "☕ Cafe", "🍔 Food", "🏖️ Travel", "🏠 Home", "💼 Work", "📍 General"];

export default function SavedPlaces({ places, onSelect, onDelete, selectedPlaceId }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    if (!places || places.length === 0) return null;

    const filteredPlaces = places.filter((place) => {
        const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (place.notes && place.notes.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = selectedCategory === "All" || place.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className={`saved-places-wrapper ${isCollapsed ? "collapsed" : ""}`}>
            {/* Header / Toggle bar */}
            <div className="saved-places-header" onClick={() => setIsCollapsed(!isCollapsed)}>
                <div className="header-left">
                    <span className="title-icon">⭐</span>
                    <span className="title-text">Saved Places</span>
                    <span className="count-badge">{places.length}</span>
                </div>
                <button
                    className="toggle-btn"
                    title={isCollapsed ? "Expand panel" : "Collapse panel"}
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsCollapsed(!isCollapsed);
                    }}
                >
                    {isCollapsed ? "▲" : "▼"}
                </button>
            </div>

            {!isCollapsed && (
                <div className="saved-places-body">
                    {/* Search input */}
                    <div className="places-search-box">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Filter saved places..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button className="clear-search" onClick={() => setSearchQuery("")}>
                                ✕
                            </button>
                        )}
                    </div>

                    {/* Category Filter Chips */}
                    <div className="category-chips">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                className={`chip ${selectedCategory === cat ? "active" : ""}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Places List */}
                    <div className="places-list">
                        {filteredPlaces.length === 0 ? (
                            <div className="empty-filter-state">
                                <span>🔍 No matching places found</span>
                            </div>
                        ) : (
                            filteredPlaces.map((place) => {
                                const isSelected = selectedPlaceId === place.id;
                                return (
                                    <div
                                        key={place.id}
                                        className={`saved-place-card ${isSelected ? "selected" : ""}`}
                                        onClick={() => onSelect(place)}
                                    >
                                        <div className="place-avatar">
                                            {place.image ? (
                                                <img src={place.image} alt={place.name} className="place-thumb" />
                                            ) : (
                                                <div className="place-icon-badge">
                                                    {place.category ? place.category.split(" ")[0] : "📍"}
                                                </div>
                                            )}
                                        </div>

                                        <div className="place-details">
                                            <div className="place-name">{place.name}</div>
                                            <div className="place-meta">
                                                <span className="category-tag">{place.category || "📍 General"}</span>
                                                <span className="coords">
                                                    {(place.latitude || place.lat).toFixed(2)}, {(place.longitude || place.lng).toFixed(2)}
                                                </span>
                                            </div>
                                            {place.notes && <div className="place-notes">{place.notes}</div>}
                                        </div>

                                        <button
                                            className="delete-card-btn"
                                            title="Delete place"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete(place.id);
                                            }}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
