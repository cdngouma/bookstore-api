const fetch = require('node-fetch');
const Book = require('../models/book');
const Op = (require('sequelize')).Op;

exports.getBookById = (req, res, next) => {
    Book.findByPk(req.params.bookId)
    .then(book => {
        if (book) {
            res.status(200).json(book);
        }
        else {
            res.status(404).json({
                message: 'Not Found'
            });
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
}

// find book by ISBN or find all books
exports.getAllBooks = (req, res, next) => {
    const isbn = req.query.isbn;
    // find the book corresponding to the given ISBN   
    // preview book
    if(isbn && req.query.preview) {
        previewBook(isbn, res);
    }
    else if(isbn) {
        getFullBookDetails(isbn, res);
    }
    else {
    // filter list of books based by author, category and publication date
        const filter = {};
        if(req.query.author) filter.where.author = req.query.author;
        if(req.query.category) filter.where.category = req.query.category;
        if(req.query.publicationYear) filter.where.publicationYear = req.query.publicationYear;
        console.log(filter);
        
        Book.findAll(filter)
        .then(books => {
            if (books) {
                res.status(200).json(books);
            }
            else {
                res.status(204).json({ message: 'No book available' });
            }
        })
        .catch((err) => {
            res.status(500).json({
                error: err
            });
        });
    }
}

function getFullBookDetails(isbn, res) {
    Book.findOne({
        where: {
            $or: [
                { isbn10: isbn },
                { isbn13: isbn }
            ]
        }
    })
    .then(book => {
        // if book is in database, return book
        if(book) {
            res.status(200).json(book);
        }
        else {
            res.status(404).json({ message: 'Not Found' });
        }
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}

function previewBook(isbn, res) {
    // get book info from database
    Book.findOne({
        where: {
            [Op.or]: [ { isbn10: isbn }, { isbn13: isbn } ]
        },
        attributes: ['isbn10', 'isbn13', 'title', 'author', 'publishedDate', 'category', 'imageLink']
    })
    .then(book => {
        if(book){
            res.status(200).json(book);
        }
        else {
        // if no data found in database, fetch data from Google books
            fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`)
            .then(response => response.json()).then(response => {
                if(response.totalItems > 0){
                    const newBook = extractBookDetails(response.items[0], isbn);      
                    res.status(200).json(newBook);
                }
                else{
                    res.status(404).json({ message: 'Not Found' });
                }
            })
            .catch(err => {
                res.status(500).json({ error: err });
            });
        }
    })
    .catch(err => {
        res.status(500).json({ error: err});
    });
}

function extractBookDetails(data, isbn){
    // extract ISBN codes
    let isbn10 = isbn.length == 10 ? isbn : null;
    let isbn13 = isbn.length == 13 ? isbn : null;
    for(o of data.volumeInfo.industryIdentifiers){
        if(o.type === 'ISBN_10') isbn10 = o.identifier;
        else if(o.type === 'ISBN_13') isbn13 = o.identifier;
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