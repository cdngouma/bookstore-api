const express = require('express');
const BookController = require('../controllers/book');
const router = express.Router();

router.get('/', BookController.findAll);

router.get('/:book_id', BookController.findById);

module.exports = router;