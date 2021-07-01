const mongoose = require("mongoose");

// Creating a book schema
const BookSchema = mongoose.Schema({
    ISBN: String,
    title: String ,
    authors: [Number],
    language: String ,
    pubDate: String ,
    numPage: Number,
    category: [String] ,
    publication: Number,
});

// Create a book model
const BookModel = mongoose.model(BookSchema);
module.exports = BookModel;