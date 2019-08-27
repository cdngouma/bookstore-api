const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Author = require('../models/author');

const DOMAIN = 'http://localhost:3000';

router.get('/', (req, res, next) => {
    Author.find().exec()
    .then(docs => {
        if(docs.length >= 1){
            const response = {
                count: docs.length,
                authors: docs.map(doc => {
                    doc.request = {
                        type: 'GET',
                        url: DOMAIN + '/books/' + doc._id
                    }
                    return doc;
                })
            }
                       
            res.status(200).json(response);
        }
        else{
            res.status(200).json({ message: 'No author available'});
        }
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
});

router.post('/', (req, res, next) => {
    const author = new Author({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description
    });

    author.save()
    .then(newAuthor => {
        res.status(200).json({
            message: 'Author created',
            author: newAuthor
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

router.get('/:authorId', (req, res, next) => {
    const id = req.params.authorId;
    Author.findById(id).exec()
    .then(author => {
        if(author) res.status(200).json({author});
        else res.status(404).json({message: 'Not Found'});
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

/** TODO: implement PATCH request */

router.delete('/:authorId', (req, res, next) => {
    const id = req.params.authorId;
    Author.deleteOne(id).exec()
    .then(author => {
        res.status(404).json({message: `Author removed [${id}]`});
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;