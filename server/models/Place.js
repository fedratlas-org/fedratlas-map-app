const mongoose = require("mongoose");

const PlaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        default: "General / Other"
    },
    listName: {
        type: String,
        default: "My Favorites"
    },
    notes: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: ""
    },
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

PlaceSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id.toString();
        ret.latitude = ret.lat;
        ret.longitude = ret.lng;
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model("Place", PlaceSchema);
