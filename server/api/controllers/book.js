const fetch = require('node-fetch');
const Book = require('../models/book');
const Op = (require('sequelize')).Op;

// GET book by id
exports.findById = (req, res, next) => {
    const book_id = req.params.book_id;
    Book.findByPk(book_id).then(book => {
        if (book) {
            res.status(200).json(book);
        }
        else {
            res.status(404).json({
                message: 'Not Found'
            });
        }
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
}

// GET book by ISBN or find all books
exports.findAll = (req, res, next) => {
    const isbn = req.query.isbn;

    if (isbn && req.query.preview) {
        previewBook(isbn, res);
    }
    else if (isbn) {
        getFullBookDetails(isbn, res);
    }
    // Filter result by author, category, and publication date
    else {
        let filters = {};
        if (req.query.author) filters.where.authorId = req.query.authorId;
        if (req.query.category) filters.where.category = req.query.category;
        if (req.query.year) filters.where.publicationYear = req.query.year;

        Book.findAll(filters).then(books => {
            if (books) {
                res.status(200).json(books);
            }
            else {
                res.status(204).json();
            }
        }).catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    }
}

// GET complete book details
function getFullBookDetails(isbn, res) {
    Book.findOne({
        where: {
            [Op.or]: [
                { isbn10: isbn },
                { isbn13: isbn }
            ]
        }
    }).then(book => {
        if (book) {
            res.status(200).json(book);
        }
        else {
            res.status(404).json({
                message: 'Not Found'
            });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
}

// GET book general information
function previewBook(isbn, res) {
    // Try to retrieve book details from database
    Book.findOne({
        where: {
            [Op.or]: [
                { isbn10: isbn },
                { isbn13: isbn }
            ]
        },
        attributes: ['isbn10', 'isbn13', 'title', 'author_id', 'publishedDate', 'category', 'imageLink']
    }).then(book => {
        if (book) {
            res.status(200).json(book);
        }
        // Fetch data from Google Books
        else {
            const URI = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
            return fetch(URI).then(response => response.json()).then(response => {
                if (response.totalItems) {
                    const newBook = extractBookDetails(response.items[0], isbn);
                    res.status(200).json(newBook);
                }
                else {
                    res.status(404).json({ message: 'Not Found' });
                }
            });
        }
    }).catch(err => {
        res.status(500).json({ error: err });
    });
}

function extractBookDetails(data, isbn) {
    // extract ISBN codes
    let isbn10 = isbn.length == 10 ? isbn : null;
    let isbn13 = isbn.length == 13 ? isbn : null;
    for (o of data.volumeInfo.industryIdentifiers) {
        if (o.type === 'ISBN_10') isbn10 = o.identifier;
        else if (o.type === 'ISBN_13') isbn13 = o.identifier;
    }
    // construct new book object
    const imageLink = `http://books.google.com/books/content?id=${data.id}&printsec=frontcover&img=1&zoom=0&edge=curl&source=gbs_api`;
    return {
        isbn10: isbn10,
        isbn13: isbn13,
        title: data.volumeInfo.title,
        author: data.volumeInfo.authors[0],
        publishedDate: data.volumeInfo.publishedDate,
        category: data.volumeInfo.categories[0],
        imageLink: imageLink
    }
}