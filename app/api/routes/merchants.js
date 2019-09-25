const express = require('express');
const MerchantController = require('../controllers/merchant-controller');
const checkAuth = require('../middleware/auth');

const router = express.Router();

router.post('/join', checkAuth, MerchantController.becomeAMerchant);
// advertise a new book
router.post('/:username/products', checkAuth, MerchantController.advertiseNewProduct);

module.exports = router;