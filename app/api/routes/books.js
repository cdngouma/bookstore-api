const express = require('express');
const BookController = require('../controllers/book-controller');
const router = express.Router();

router.get('/', BookController.getAllBooks);

router.get('/:bookId', BookController.getBookById);

module.exports = router;
