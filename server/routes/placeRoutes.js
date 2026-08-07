const express = require("express");
const router = express.Router();
const Place = require("../models/Place");

// GET /api/places - Get all saved places
router.get("/", async (req, res) => {
    try {
        const places = await Place.find().sort({ createdAt: -1 });
        res.status(200).json(places);
    } catch (error) {
        console.error("Error fetching places:", error);
        res.status(500).json({ error: "Failed to fetch saved places" });
    }
});

// GET /api/places/:id - Get a single saved place by ID
router.get("/:id", async (req, res) => {
    try {
        const place = await Place.findById(req.params.id);
        if (!place) {
            return res.status(404).json({ error: "Place not found" });
        }
        res.status(200).json(place);
    } catch (error) {
        console.error("Error fetching place:", error);
        res.status(500).json({ error: "Failed to fetch place" });
    }
});

// POST /api/places - Create a new saved place
router.post("/", async (req, res) => {
    try {
        const { name, category, listName, notes, image, lat, lng } = req.body;
        
        if (!name || lat === undefined || lng === undefined) {
            return res.status(400).json({ error: "Name, latitude, and longitude are required." });
        }

        const newPlace = new Place({
            name,
            category,
            listName,
            notes,
            image,
            lat,
            lng
        });

        const savedPlace = await newPlace.save();
        res.status(201).json(savedPlace);
    } catch (error) {
        console.error("Error saving place:", error);
        res.status(500).json({ error: "Failed to save place to database" });
    }
});

// DELETE /api/places/:id - Delete a saved place by ID
router.delete("/:id", async (req, res) => {
    try {
        const deletedPlace = await Place.findByIdAndDelete(req.params.id);
        if (!deletedPlace) {
            return res.status(404).json({ error: "Place not found" });
        }
        res.status(200).json({ message: "Place deleted successfully", id: req.params.id });
    } catch (error) {
        console.error("Error deleting place:", error);
        res.status(500).json({ error: "Failed to delete place" });
    }
});

module.exports = router;
