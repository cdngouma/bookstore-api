const Sequelize = require('sequelize');
const db = require('../config/database');
const Book = require('./book');
const Merchant = require('./merchant');

const Product = db.define('product', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    bookId: {
       type: Sequelize.STRING,
       field: 'book_id',
       references: {
           model: Book,
           key: 'id'
       }
    },
    merchantId: {
        type: Sequelize.STRING,
        field: 'merchant_id',
        references: {
            model: Merchant,
            key: 'id'
        }
    },
    price: {
       type: Sequelize.DOUBLE,
       allowNull: false
    },
    quality: {
       type: Sequelize.DATE,
       allowNull: false
    },
    printType: {
       type: Sequelize.STRING,
       allowNull: false,
       field: 'print_type'
    },
    width: {
       type: Sequelize.FLOAT,
       allowNull: false
    },
    length: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    thickness: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    weight: {
       type: Sequelize.FLOAT,
       allowNull: false
    },
    createdAt: {
       type: Sequelize.DATE,
       defaultValue: Sequelize.NOW,
       field: 'created_at'
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        field: 'last_modified'
    }
});

module.exports = Product;