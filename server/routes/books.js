const express = require('express');
const BookController = require('../controllers/book-controller');
const router = express.Router();

router.get('/', BookController.getBooks);

router.get('/:bookId', BookController.getBook);

module.exports = router;
