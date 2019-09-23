const fetch = require('node-fetch');
const Book = require('../models/Book');

exports.getBook = (req, res, next) => {
    const bookId = req.params.bookId;
    Book.findById(bookId).then(rows => {
        if (rows.length > 0) {
            res.status(200).json(rows[0]);
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

// find book by ISBN or find all books
exports.getBooks = (req, res, next) => {
    const isbn = req.query.isbn;
    // find the book corresponding to the given ISBN   
    // preview book
    if(isbn && req.query.preview) {
        previewBook(isbn, res);
    }
    else if(isbn) {
        getFullBookDetails(isbn, res);
    }
    // find list of books based on criteria: author and category
    // TODO: Fix query
    else {
        const author = req.query.author || null;
        const category = req.query.category || null;
        const publicationYear = req.query.year || null;
        const SQL = 'SELECT id, isbn10, isbn13, author, title, category, cover AS imageLink FROM Books\n' +
                    'WHERE (? IS NULL OR author LIKE (?)) AND (? IS NULL OR category LIKE (?)) AND (? IS NULL OR published_date=?)';
        Book.query(SQL, {author: author, category:category}).then(rows => {
            if (rows.length > 0) {
                res.status(200).json(rows);
            }
            else {
                res.status(204).json({ message: 'No book available' });
            }
        }).catch((err) => {
            res.status(500).json({
                error: err
            });
        });
    }
}

function getFullBookDetails(isbn, res) {
    Book.findByIsbn(isbn).then(rows => {
        // if book is in database, return book
        if(rows.length > 0) {
            res.status(200).json(rows[0]);
        }
        else {
            res.status(404).json({ message: 'Not Found' });
        }
    }).catch(err => {
        res.status(500).json({ error: err });
    });
}

function previewBook(isbn, res) {
    Book.query('SELECT id, isbn10, isbn13, title, author, category, image_link AS imageLink FROM Books WHERE isbn13=? OR isbn10 = ?', {isbn})
    .then(rows => {
    // get book info from database
        if(rows.length > 0){
            res.status(200).json(rows[0]);
        }
    // if no data found in database, fetch data from Google books
        else {
            fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`)
            .then(response => response.json()).then(response => {
                if(response.totalItems > 0){
                // extract book data
                    const book = extractBookDetails(response.items[0], isbn);             
                    res.status(200).json(book);
                }
                else{
                    res.status(404).json({ message: 'Not Found' });
                }
            }).catch(err => {
                res.status(500).json({ error: err });
            });
        }
    }).catch(err => {
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