require("dotenv").config();

// Frame Work 
const express = require("express");
const mongoose = require("mongoose");

// Microservices Routes
const Books = require("./API/Book");
const Authors = require("./API/Author");
const Publications = require("./API/Publication");

// Database 
// const database = require("./database/index");

// Models
// const BookModel = require("./database/books");
// const AuthorModel = require("./database/authors");
// const PublicationModel = require("./database/publication");

// Initialization express
const booky = express();

// Configuration
booky.use(express.json());

// Establish Connection Database
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})
.then(() => console.log("Connection Established!!!!!!"));

// Initializing Microservices
booky.use("/book", Books);
booky.use("/author", Authors);
booky.use("/publication", Publications);

booky.listen(9000, () => console.log("Hey server is running"));