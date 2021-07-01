const mongoose = require("mongoose");

// Creating a publication schema
const PublicationSchema = mongoose.Schema({
    id: Number,
    name: String,
    books: [String],
});

// Publication Model
const PublicationModel = mongoose.model(PublicationSchema);

module.exports = PublicationModel;