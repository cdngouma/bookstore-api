const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();
const db = require('../database/db');
const checkAuth = require('../auth/check-auth');

router.get('/', (req, res, next) => {
    const isbn = req.query.isbn;
    // find the book corresponding to the given ISBN
    if(isbn && req.query.d) {
        // if full details requested check if book is in database
        db.query('SELECT id, isbn10, isbn13, author, title, publisher, published_date AS publishedDate, edition, pages AS pageCount,' +
                ' category, lang AS `language`, `desc` AS `description`, cover, created_at AS createdAt FROM Books WHERE isbn13='+isbn+' OR isbn10='+isbn)
        .then(rows => {
            // if book is in database, return book
            if(rows.length > 0) {
                res.status(200).json(rows[0]);
            }
            else {
                res.status(404).json({ message: 'Not Found' });
            }
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
    }
    else if(isbn) {
        // if general info requested
        db.query('SELECT id, isbn10, isbn13, title, author, category, cover FROM BookGeneral WHERE isbn13='+isbn+' OR isbn10='+isbn)
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
                        const details = extractBookDetails(response.items[0].volumeInfo, isbn);                      
                        res.status(200).json(details);
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
    // find list of books based on criteria: author and category
    else {
        const author = req.query.author || null;
        const category = req.query.category || null;
        const SQL = 'SELECT id, isbn10, isbn13, author, title, category, cover FROM BookGeneral B\n' +
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

router.post('/', (req, res, next) => {
    res.status(200).json({
        message: 'TODO: Implement POST for Books'
    });
});

router.get('/:bookId', (req, res, next) => {
    const bookId = req.params.bookId;
    const SQL = 'SELECT id, isbn10, isbn13, author, title, publisher, published_date AS publishedDate, edition, pages AS pageCount,' +
                'category, lang AS `language`, `desc` AS `description`, cover, created_at AS createdAt FROM Books WHERE id = ?';
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
    res.status(200).json({
        message: 'TODO: Implement PATCH/PUT for Books'
    });
});

router.delete('/:bookId', checkAuth, (req, res, next) => {
    const bookId = req.params.bookId;
    db.query('DELETE FROM Books WHERE id = ?', [bookId]).then(rows => {
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

function extractBookDetails(data, isbn){
    // extract ISBN codes
    let isbn10 = isbn.length == 10 ? isbn : null;
    let isbn13 = isbn.length == 13 ? isbn : null;
    for(o of data.industryIdentifiers){
        if(o.type === 'ISBN_10') isbn10 = o.identifier;
        else if(o.type === 'ISBN_13') isbn13 = o.identifier;
    }
    // construct new book object
    return {
        isbn10: isbn10,
        isbn13: isbn13,
        title: data.title,
        author: data.authors[0],
        category: data.categories[0],
        cover: data.imageLinks.thumbnail
    }
}

module.exports = router;