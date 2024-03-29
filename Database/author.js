const mongoose = require("mongoose");

// Creating a author schema
const AuthorSchema = mongoose.Schema({
    id: Number,
    name: String,
    books: [String],
});

// Author Model
const AuthorModel = mongoose.model("authors", AuthorSchema);

module.exports = AuthorModel;