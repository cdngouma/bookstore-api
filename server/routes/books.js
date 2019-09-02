const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Book = require('../models/book');

router.get('/', (req, res, next) => {
    Book.findAll()
    .then(books => {
        if(books.length >= 1) {
        /*    const response = {
                count: docs.length,
                books: docs.map(doc => {
                    doc.request = {
                        type: 'GET',
                        url: DOMAIN + '/books/' + doc._id
                    }
                    return doc;
                })
            } */         
            res.status(200).json(books);
        }
        else {
            res.status(200).json({message: 'No book available'});
        }
    })
    .catch((err) => { 
        res.status(500).json({ error: err }) 
    });
});

/*// find books per year
router.get('/:year/', (req, res, next) => {
    Book.find().$where({"details.publicationYear": {$eq: req.params.year}})
    .exec()
    .then((books) => {
        console.log(`found (${books.length}) books`);
        if(books.length > 0) res.status(200).json({books});
        else res.status(200).json({ message: 'No book available' });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err });
    });
});*/

router.post('/', (req, res, next) => {
    const book = {
        title: req.body.title,
        author: req.body.author,
        isbn: req.body.isbn,
        publisher: req.body.publisher,
        publicationYear: req.body.publicationYear,
        edition: req.body.edition,
        pages: req.body.pages,
        language: req.body.language,
        width: req.body.width,
        height: req.body.height,
        length: req.body.length,
        weight: req.body.weight,
        description: req.body.description,
        price: req.body.price,
        cover: req.body.cover
    }

    Book.create(book).then((newBook) => {
        console.log(`new book created successfully [${newBook.id}]`);
        res.status(201).json({
            message: 'Book created',
            book: newBook
        });
    })
    .catch((err) => {
    //    console.log(err);
        res.status(500).json({ error: err });
    });
});

/*
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
});*/

/** TODO: improve patch to update only specified fields */
/*
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
*/

router.delete('/:bookId', (req, res, next) => {
    const id = req.params.bookId;
    Book.destroy({
        where: {
            id: id
        }
    })
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