const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const ProductSchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quality: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['IN_STOCK','RUNNING_LOW','OUT_OF_STOCK'],
        required: true
    }
});

ProductSchema.plugin(timestamp);

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;