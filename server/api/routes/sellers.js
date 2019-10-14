const express = require('express');
const SellerController = require('../controllers/seller');

const router = express.Router();

router.post('/:user_id/join', SellerController.becomeASeller);

router.post('/:user_id/products', SellerController.addNewProduct);

module.exports = router;