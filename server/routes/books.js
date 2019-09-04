const express = require('express');
const router = express.Router();
const db = require('../config/database');
const checkAuth = require('../auth/check-auth')

router.get('/', (req, res, next) => {
    const SQL = 'SELECT id, author, isbn, title, `year` AS publicationYear, price, cover FROM Books';
    db.query(SQL)
        .then(rows => {
            if (rows.length > 0)
                res.status(200).json(rows);
            else
                res.status(204).json({
                    message: 'No book available'
                });
        })
        .catch((err) => {
            res.status(500).json({
                error: err
            });
        });
});

router.post('/', checkAuth, (req, res, next) => {
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

router.patch('/:bookId', (req, res, next) => {
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

router.delete('/:bookId', (req, res, next) => {
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