const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const librarySchema = new Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    country: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: Number, required: true },
    zip4: { type: Number, required: false },
    books: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Book' }]

});


module.exports = mongoose.model('Library', librarySchema);