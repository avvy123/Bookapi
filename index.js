require("dotenv").config();
// Frame Work 
const express = require("express");
const mongoose = require("mongoose");

// Database 
const database = require("./database/index");

// Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

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

/* 
    Route               /
    Description         Get all books
    Access              PUBLIC
    Parameter           None
    Methods             GET
*/

booky.get("/", async (req, res) =>
{
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);
});

/* 
    Route               /is
    Description         Get specific books based on ISBN
    Access              PUBLIC
    Parameter           isbn
    Methods             GET
*/

booky.get("/is/:isbn", async (req, res) =>
{
   const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn});
   if (!getSpecificBook)
    {
        return res.json({error: `No book found for the ISBN of ${req.params.isbn}`,
         });
    }
    return res.json({ books: getSpecificBook });
});

/* 
    Route               /c
    Description         Get specific books based on category
    Access              PUBLIC
    Parameter           Category
    Methods             GET
*/

booky.get("/c/:category", async (req, res) =>
{
    const getSpecificBook = await BookModel.findOne({
        category: req.params.category,
    });
    if (!getSpecificBook)
    {
        return res.json({error: `No book found for the Category of ${req.params.category}`,
         });
    }
    return res.json({books: getSpecificBook});
});

/* 
    Route               /author
    Description         Get all authors
    Access              PUBLIC
    Parameter           None
    Methods             GET
*/

booky.get("/author", async (req, res) =>
{
    const getAllAuthors = await AuthorModel.find();
    return res.json({ authors: getAllAuthors });
});

/* 
    Route               /author/book
    Description         Get all authors based on books
    Access              PUBLIC
    Parameter           ISBN
    Methods             GET
*/

booky.get("/author/book/:isbn", (req, res) =>
{
    const getSpecificAuthor = database.author.filter((author) => author.books.includes(req.params.isbn));
    if (getSpecificAuthor.length === 0)

    {
        return res.json({error: `No Author found for the book of ${req.params.isbn}`,
        });
    }
    return res.json({ authors: getSpecificAuthor });
});

/* 
    Route               /publications
    Description         Get all publications
    Access              PUBLIC
    Parameter           None
    Methods             GET
*/

booky.get("/publications", (req, res) =>
{
    return res.json({ publications: database.publication });
});

/* 
    Route               /book/add
    Description         add new book
    Access              PUBLIC
    Parameter           None
    Methods             POST
*/
booky.post("/book/add",(req, res) =>
{
    const { newBook } = req.body;

     BookModel.create(newBook);

    return res.json ({ message: "book was added" });
});

/* 
    Route               /author/add
    Description         add new author 
    Access              PUBLIC
    Parameter           None
    Methods             POST
*/

booky.post("/author/add", (req, res) =>
{
    const { newAuthor } = req.body;

    AuthorModel.create(newAuthor);

    return res.json ({ message: "author was added" });
});

/* 
    Route               /publication/add
    Description         add new publication 
    Access              PUBLIC
    Parameter           None
    Methods             POST
*/
booky.post("/publication/add",(req, res) =>
{
    const { newPublication } = req.body;
    database.publication.push(newPublication);
    return res.json ({ publications: database.publication });
});

/* 
    Route               /book/update
    Description         update book title
    Access              PUBLIC
    Parameter           ISBN
    Methods             PUT
*/

booky.put("/book/update/:isbn", async (req, res) =>
{
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn,
        },
        {
            title: req.body.bookTitle,
        },
        {
            new: true,
        }
);
       /*
        database.books.forEach((book) =>
        {
            if(book.ISBN === req.params.isbn)
            {
                book.title = req.body.bookTitle;
                return;
            }
        });*/

    return res.json({books: updatedBook});
});

/* 
    Route               /book/update/author
    Description         update/add new author for a book
    Access              PUBLIC
    Parameter           ISBN
    Methods             PUT
*/

    booky.put("/book/update/author/:isbn", async (req, res) => {
    // update book database 

    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn,
        },
        {
            $addToSet: {
                authors: req.body.newAuthor,
            },
        },
        {
            new: true,
        }
    );
   
    
    // database.books.forEach((book) =>
    // {
    //     if (book.ISBN === req.params.isbn) {
    //         return book.author.push(parseInt(req.params.authorId));
    //     }
    // });
    // update author database 
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: req.body.newAuthor,
        },
        {
            $addToSet:
            {
                books: req.params.isbn,
            },
        },
        {
            new: true,
        }
        );
    // database.author.forEach((author) =>
    // {
    //     if(author.id === parseInt (req.params.authorId)) {
    //         return author.books.push(req.params.isbn);
    //     }
    // }); 
    

    return res.json({ 
        books: updatedBook,
         author: updatedAuthor, 
         message: "Author was aaded successfully" 
        });
}); 

/* 
    Route               /publication/update/book
    Description         update/add new book to publication
    Access              PUBLIC
    Parameter           ISBN
    Methods             PUT
*/

booky.put("/publication/update/book/:isbn",(req, res) => {
    // update the publication database 
    database.publication.forEach((publication) => {
        if (publication.id === req.body.pubId) {
            return publication.books.push(req.params.isbn);
        }
    });

    // update the book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.publication = req.body.pubId;
            return;
        }
    });
    return res.json({ 
        books: database.books,
        publication: database.publication,
    });
});

/* 
    Route               /book/delete
    Description         delete a book
    Access              PUBLIC
    Parameter           ISBN
    Methods             Delete
*/

booky.delete("/book/delete/:isbn", async (req, res) =>
{
    const updatedBookDatabase = await BookModel.findOneAndDelete(
        {
            ISBN: req.params.isbn,
        }
    );

    // const updatedBookDatabase = database.books.filter((book) => book.ISBN !== req.params.isbn);
    // database.books = updatedBookDatabase;
    return res.json({ books: updatedBookDatabase });
});

/* 
    Route               /book/delete/author
    Description         delete a author from a book
    Access              PUBLIC
    Parameter           ISBN
    Methods             Delete
*/
booky.delete("/book/delete/author/:isbn/:authorId",async (req, res) =>
{
    // update the book database
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn,
        },
        {
            $pull:
            {
                authors: parseInt(req.params.authorId),
            },
        },
        {
                mew: true
        }
    );
    // database.books.forEach((book) => {
    //     if(book.ISBN === req.params.isbn){
    //         const newAuthorList = book.authors.filter((author) => author !== parseInt(req.params.authorId)
    //         );
    //         book.author = newAuthorList;
    //         return;
    //     }
    // });

    // update the author database
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: parseInt(req.params.authorId),
        },
        {
            $pull:{
                books: req.params.isbn,
            },
        },
        {
            new: true
        }
    );
    // database.authors.forEach((author) => {
    //     if(author.id === parseInt(req.params.authorId)) {
    //         const newBookList = author.books.filter((book) => book.ISBN !== req.params.isbn);

    //         author.books = newBookList;
    //         return;
    //     }
    // });

    return res.json({ 
        message: "author was deletd",
        book: updatedBook, 
        author: updatedAuthor,
    });
});

/* 
    Route               /publication/delete/book
    Description         delete a book from publication
    Access              PUBLIC
    Parameter           ISBN
    Methods             Delete
*/
booky.delete("/publication/delete/book/:isbn/:pubId",(req, res) =>
{
    // update publication database
    database.publication.forEach((publication) =>
    {
        if(publication.id === parseInt(req.params.pubId)) {
            const newBookList = publication.books.filter(
                (book) => book !== req.params.isbn);
                publication.books = newBookList;
                return;
        }
    });
    // update book database
    database.books.forEach((book) =>
    {
        if(book.ISBN === req.params.isbn) {
            book.publiaction = 0;
            return;
        }
    });

    return res.json({
        books: database.books,
        publication: database.publication,
    });
});

booky.listen(8000, () => console.log("Hey server is running"));