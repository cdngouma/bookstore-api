const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Book = require('../models/book');

router.get('/', (req, res, next) => {
    Book.find()
    .exec()
    .then((books) => {
        console.log(`found (${books.length}) books`);
        if(books.length > 0) {
            res.status(200).json({books});
        }
        else{
            res.status(200).json({ message: 'No book available' });
        }
    })
    .catch((err) => {
        res.status(500).json({ error: err });
    });
});

// find books per year
router.get('/:year/', (req, res, next) => {
    Book.find().$where({"details.publicationYear": {$eq: year}})
    .exec()
    .then((books) => {
        console.log(`found (${books.length}) books`);
        if(books.length > 0) {
            res.status(200).json({books});
        }
        else{
            res.status(200).json({ message: 'No book available' });
        }
    })
    .catch((err) => {
        res.status(500).json({ error: err });
    });
});

router.post('/', (req, res, next) => {
    const  book = new Book({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        author: req.body.authors,
        details: req.details,
        description: req.body.description,
        price: req.body.price,
        coverImage: req.body.coverImage
    })

    book.save()
    .then((newBook) => {
        console.log(`new book created successfully [${result._id}]`);
        res.status(201).json({
            message: 'Book created',
            createdBook: newBook
        });
    })
    .catch((err) => {
        res.status(500).json({ error: err });
    });
});

router.get('/:bookId', (req, res, next) => {
    const id = req.params.bookId;
    Book.findById(id)
    .exec()
    .then((book) => {
        if(book){
            console.log(`found book [${book._id}]`);
            res.status(200).json({book});
        }else{
            console.log("Not found");
            res.status(404).json({ message: 'Not Found' });
        }
    })
    .catch((err) => {
        res.status(500).json({ error: err });
    });
});

router.patch('/:bookId', (req, res, next) => {
    const id = req.params.bookId;
    // extract valid fields from request body
    // format:  {"propName": "prop", "value": "value"}
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Book.update({_id: id}, {$set: updateOps}).exec()
    .then(book => {
        res.status(200).json({
            message: 'Book updated',
            updatedBook: book
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:bookId', (req, res, next) => {
    const id = req.params.bookId;
    Book.remove({_id: id}).exec()
    .then(result => {
        res.status(400).json({
            message: `Book deleted [${id}]`
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;