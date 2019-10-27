const Book = require('../models/Book');
const router = (require('express')).Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: "test"
    });
});

router.get('/:bookId', (req, res, next) => {
    res.status(200).json({
        message: "single book test"
    });
});

module.exports = router;