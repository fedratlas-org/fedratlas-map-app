import React, { useState, useRef } from "react";
import "./SavePlaceModal.css";
import { 
    HiBookmark, 
    HiXMark, 
    HiTag, 
    HiFolder, 
    HiListBullet, 
    HiDocumentText, 
    HiPhoto, 
    HiChevronDown,
    HiArrowUpTray,
    HiCheckCircle
} from "react-icons/hi2";

const CATEGORIES = [
    "Parks & Recreation",
    "Cafes & Restaurants",
    "Shopping & Malls",
    "Travel & Nature",
    "Home & Work",
    "General / Other"
];

const LIST_OPTIONS = [
    "My Favorites",
    "Want to go",
    "Starred places",
    "Custom List"
];

export default function SavePlaceModal({ location, onSave, onClose }) {
    const [name, setName] = useState(location?.name || "");
    const [category, setCategory] = useState("Parks & Recreation");
    const [listName, setListName] = useState("My Favorites");
    const [notes, setNotes] = useState("");
    const [image, setImage] = useState("");
    const [showImageInput, setShowImageInput] = useState(false);
    const fileInputRef = useRef(null);

    const latVal = location?.lat !== undefined ? location.lat : 6.9271;
    const lngVal = location?.lng !== undefined ? location.lng : 79.8612;

    const handleFileChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file (JPG, PNG, WebP, etc.).");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const maxDim = 1200;
                let width = img.width;
                let height = img.height;
                if (width > maxDim || height > maxDim) {
                    if (width > height) {
                        height = Math.round((height * maxDim) / width);
                        width = maxDim;
                    } else {
                        width = Math.round((width * maxDim) / height);
                        height = maxDim;
                    }
                }
                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);
                const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
                setImage(dataUrl);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) {
            alert("Please enter a place name.");
            return;
        }
        onSave({
            name: name.trim(),
            category,
            listName,
            notes: notes.trim(),
            image: image.trim(),
            lat: latVal,
            lng: lngVal,
        });
    };

    return (
        <div className="save-modal-overlay" onClick={onClose}>
            <div className="save-modal-container" onClick={(e) => e.stopPropagation()}>
                
                {/* Header */}
                <div className="save-modal-header">
                    <div className="header-left-badge">
                        <div className="purple-bookmark-circle">
                            <HiBookmark className="bookmark-icon" />
                        </div>
                        <div className="header-titles">
                            <h3>Save Place</h3>
                            <p>Add this location to your saved places</p>
                        </div>
                    </div>
                    <button className="save-modal-close-btn" onClick={onClose} title="Close">
                        <HiXMark />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="save-modal-form">
                    
                    {/* Place Name Input */}
                    <div className="field-group">
                        <label>Place name</label>
                        <div className="input-with-icon">
                            <HiTag className="field-icon" />
                            <input
                                type="text"
                                value={name}
                                maxLength={100}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter place name..."
                                required
                            />
                            <span className="char-counter">{name.length}/100</span>
                        </div>
                    </div>

                    {/* Category Select */}
                    <div className="field-group">
                        <label>Category</label>
                        <div className="select-with-icon">
                            <HiFolder className="field-icon" />
                            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <HiChevronDown className="select-arrow-icon" />
                        </div>
                    </div>

                    {/* Add to list */}
                    <div className="field-group">
                        <label>Add to list <span className="optional-tag">(optional)</span></label>
                        <div className="select-with-icon">
                            <HiListBullet className="field-icon" />
                            <select value={listName} onChange={(e) => setListName(e.target.value)}>
                                {LIST_OPTIONS.map((lst) => (
                                    <option key={lst} value={lst}>{lst}</option>
                                ))}
                            </select>
                            <HiChevronDown className="select-arrow-icon" />
                        </div>
                    </div>

                    {/* Notes Input */}
                    <div className="field-group">
                        <label>Notes <span className="optional-tag">(optional)</span></label>
                        <div className="textarea-with-icon">
                            <HiDocumentText className="field-icon textarea-icon" />
                            <textarea
                                rows={3}
                                value={notes}
                                maxLength={200}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add a note about this place..."
                            />
                            <span className="char-counter text-counter">{notes.length}/200</span>
                        </div>
                    </div>

                    {/* Photo Upload / URL Box */}
                    <div className="field-group">
                        <label>Add a photo <span className="optional-tag">(optional)</span></label>
                        
                        {image ? (
                            <div className="photo-preview-box">
                                <img src={image} alt="Selected preview" className="photo-preview-thumbnail" />
                                <div className="photo-preview-info">
                                    <span className="photo-preview-title">Photo Attached</span>
                                    <span className="photo-preview-sub">
                                        <HiCheckCircle /> Ready to save with location
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    className="remove-photo-btn"
                                    onClick={() => {
                                        setImage("");
                                        if (fileInputRef.current) fileInputRef.current.value = "";
                                    }}
                                >
                                    <HiXMark /> Remove
                                </button>
                            </div>
                        ) : (
                            <>
                                <div 
                                    className="photo-upload-box clickable-upload"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <div className="photo-box-left">
                                        <div className="photo-icon-badge">
                                            <HiArrowUpTray />
                                        </div>
                                        <div className="photo-text-info">
                                            <span className="photo-main-text">Upload from local device file</span>
                                            <span className="photo-sub-text">Click to choose image (JPG, PNG, WebP)</span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="choose-img-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            fileInputRef.current?.click();
                                        }}
                                    >
                                        Choose File
                                    </button>
                                </div>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ display: "none" }}
                                />

                                <div className="photo-url-toggle">
                                    <button
                                        type="button"
                                        className="toggle-url-btn"
                                        onClick={() => setShowImageInput(!showImageInput)}
                                    >
                                        {showImageInput ? "Hide web URL option" : "Or enter image web URL link"}
                                    </button>
                                </div>

                                {showImageInput && (
                                    <div className="image-url-input-popover">
                                        <input
                                            type="url"
                                            placeholder="Paste image URL (https://...)"
                                            value={image}
                                            onChange={(e) => setImage(e.target.value)}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="save-modal-footer">
                        <button type="button" className="modal-cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="modal-submit-btn">
                            <HiBookmark className="btn-bookmark-icon" /> Save Place
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
}
