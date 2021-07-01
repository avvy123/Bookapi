const books = [
    {
        ISBN: "12345Book",
        title: "Getting started with MERN",
        pubDate: "2021-07-07",
        language: "English",
        numPage: 250,
        authors: [1, 2],
        publication: [1],
        category: ["tech", "programming", "education", "thriller"],
    },
];

const authors = [
    {
        id: 1,
        name: "Avinash",
        books: ["12345Book"],
    },
    {
        id: 2,
        name: "Elon Musk",
        books: ["12345Book"],
    },
];

const publication = [
    {
        id: 1,
        name: "writex",
        books: ["12345Book"],
    },
    {
        id: 2,
        name: "copyx publication",
        books: [],
    },
];

module.exports = { books, authors, publication };
