const mongoose = require("mongoose");

// Creating a book schema
const BookSchema = mongoose.Schema({
    
    ISBN: { 
        type: String,
        required: true,
        minLength: 8,
        maxLength: 10,
    },

    title: String ,
    authors: [Number],
    language: String ,
    pubDate: String ,
    numPage: Number,
    category: [String] ,
    publication: Number,
});

// Create a book model
const BookModel = mongoose.model("books", BookSchema);
module.exports = BookModel;
