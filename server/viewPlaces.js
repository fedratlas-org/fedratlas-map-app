const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const Place = require("./models/Place");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/map_web_db";

async function inspectPlaces() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("--------------------------------------------------");
        console.log("📦 MongoDB Database Inspection");
        console.log(`Connected to: ${MONGODB_URI}`);
        console.log("--------------------------------------------------\n");

        const places = await Place.find().sort({ createdAt: -1 });

        console.log(`Found ${places.length} saved place(s) in MongoDB collection 'places':\n`);

        places.forEach((p, index) => {
            console.log(`📍 Place #${index + 1}: [ID: ${p._id}]`);
            console.log(`   Name:     ${p.name}`);
            console.log(`   Category: ${p.category}`);
            console.log(`   List:     ${p.listName}`);
            console.log(`   Coords:   ${p.lat}, ${p.lng}`);
            console.log(`   Notes:    ${p.notes || "(None)"}`);
            console.log(`   Photo:    ${p.image ? (p.image.startsWith("data:") ? "[Base64 Local Photo Attached]" : p.image) : "(No photo)"}`);
            console.log(`   Saved At: ${p.createdAt}`);
            console.log("--------------------------------------------------");
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error("❌ Error querying MongoDB:", err.message);
    }
}

inspectPlaces();
