// initializing express router
const Router = require("express").Router();

// Database Models
const BookModel = require("../../database/book")

/*
    Route               /
    Description         Get all books
    Access              PUBLIC
    Parameter           None
    Methods             GET
*/

Router.get("/", async (req, res) =>
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

Router.get("/is/:isbn", async (req, res) =>
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

Router.get("/c/:category", async (req, res) =>
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
    Route               /book/add
    Description         add new book
    Access              PUBLIC
    Parameter           None
    Methods             POST
*/
Router.post("/add",(req, res) =>
{
    try{
        const { newBook } = req.body;
        
        BookModel.create(newBook);

        return res.json ({ message: "book was added" });
    } catch (error) {
        return res.json ({ error: error.message });
    }
});

/* 
    Route               /book/update
    Description         update book title
    Access              PUBLIC
    Parameter           ISBN
    Methods             PUT
*/

Router.put("/update/:isbn", async (req, res) =>
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

Router.put("/update/author/:isbn", async (req, res) => {
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
    Route               /book/delete
    Description         delete a book
    Access              PUBLIC
    Parameter           ISBN
    Methods             Delete
*/

Router.delete("/delete/:isbn", async (req, res) =>
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
Router.delete("/book/delete/author/:isbn/:authorId",async (req, res) =>
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

module.exports = Router;