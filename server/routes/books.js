const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();
const db = require('../database/db');
const checkAuth = require('../auth/check-auth');

router.get('/', (req, res, next) => {
    const isbn = req.query.isbn;
    // find the book corresponding to the given ISBN
    if(isbn && req.query.d){
        // if full details requested check if book is in database
        db.query('SELECT id, isbn_10 AS isbn10, isbn_13 AS isbn13, author, title, publisher, published_date AS publishedDate, edition, pages AS pageCount,' +
                ' category, lang AS `language`, `desc` AS `description`, thumbnail, created_at AS createdAt FROM Books WHERE isbn_13='+isbn+' OR isbn_10='+isbn)
        .then(rows => {
            // if book is in database, return book
            if(rows.length > 0){
                res.status(200).json(rows[0]);
            }
            else{
                res.status(404).json({ message: 'Not Found' });
            }
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
    }
    else if(isbn) {
        // if general info requested
        db.query('SELECT id, isbn_10 AS isbn10, isbn_13 AS isbn13, title, author, category, thumbnail FROM BookGeneral WHERE isbn_13='+isbn+' OR isbn_10='+isbn)
        .then(rows => {
            // if book is in database, return book
            if(rows.length > 0){
                res.status(200).json(rows[0]);
            }
            // if not in database, fetch data from Google books
            else {
                fetch('https://www.googleapis.com/books/v1/volumes?q=isbn:' + isbn)
                .then(response => response.json())
                .then(response => {

                    if(response.totalItems > 0){
                        // extract book data
                        const data = response.items[0].volumeInfo;
                        // extract ISBN codes
                        let isbn10 = isbn.length == 10 ? isbn : null;
                        let isbn13 = isbn.length == 13 ? isbn : null;
                        for(o of data.industryIdentifiers){
                            if(o.type === 'ISBN_10') isbn10 = o.identifier;
                            else if(o.type === 'ISBN_13') isbn13 = o.identifier;
                        }
                        // construct new book object
                        const book = {
                            isbn10: isbn10,
                            isbn13: isbn13,
                            title: data.title,
                            author: data.authors[0],
                            category: data.categories[0],
                            thumbnail: data.imageLinks.thumbnail
                        }

                        res.status(200).json(book);
                    } else{
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
    // find list of books based on criteria 
    else {
        const author = req.query.author;
        const category = req.query.category;
        const SQL = 'SELECT id, isbn_10 AS isbn10, isbn_13 AS isbn13, author, title, category, thumbnail FROM BookGeneral B\n' +
                    'WHERE ('+author+' IS NULL OR B.author = '+author+') AND ('+category+' IS NULL OR B.category='+category+')';
    db.query(SQL)
        .then(rows => {
            if (rows.length > 0)
                res.status(200).json(rows);
            else
                res.status(204).json({ message: 'No book available' });
        })
        .catch((err) => {
            res.status(500).json({
                error: err
            });
        });
    }
});

router.post('/', checkAuth, (req, res, next) => {
    const isbn = req.
    // check if book is in database
    db.query('SELECT 1 FROM Books WHERE isbn_10=? OR isbn_13=?', [isbn, isbn])
    const SQL = 'CALL EDIT_BOOK (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    const params = [
        null,
        req.body.author,
        req.body.isbn,
        req.body.title,
        req.body.publisher,
        req.body.publicationYear,
        req.body.edition,
        req.body.pages,
        req.body.language,
        req.body.width,
        req.body.height,
        req.body.length,
        req.body.weight,
        req.body.description,
        req.body.price,
        req.body.cover
    ];

    db.query(SQL, params).then(rows => {
        res.status(401).json({
            message: 'new book created',
            data: rows[0][0]
        });
    })
    .catch((err) => {
        res.status(500).json(err);
    });
});

router.get('/:bookId', (req, res, next) => {
    const bookId = req.params.bookId;
    const SQL = 'SELECT id, author, isbn, title, publisher, `year` AS publicationYear, edition, pages, `language`, width, height,' + 
                '`length`, weight, `desc` AS description, price, cover, created_at AS createdAt FROM Books WHERE id = ?';
    db.query(SQL, [bookId]).then(rows => {

        if (rows.length > 0) {
            res.status(200).json(rows[0]);
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
});

router.patch('/:bookId', checkAuth, (req, res, next) => {
    const bookId = req.params.bookId;
    const SQL = 'CALL EDIT_BOOK (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    const params = [
        bookId,
        req.body.author,
        req.body.isbn,
        req.body.title,
        req.body.publisher,
        req.body.publicationYear,
        req.body.edition,
        req.body.pages,
        req.body.language,
        req.body.width,
        req.body.height,
        req.body.length,
        req.body.weight,
        req.body.description,
        req.body.price,
        req.body.cover
    ]

    db.query(SQL, params).then(rows => {
        
        if (rows.length > 0) {
            res.status(200).json({
                message: 'book updated',
                book: rows[0]
            });
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
});

router.delete('/:bookId', checkAuth, (req, res, next) => {
    const bookId = req.params.bookId;
    const SQL = 'DELETE FROM Books WHERE id = ?';
    
    db.query(SQL, [bookId]).then(rows => {
        res.status(200).json({
            message: 'Book deleted'
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;