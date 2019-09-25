const Sequelize = require('sequelize');
const db = require('../../config/database');

const Book = db.define('book', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    isbn10: {
       type: Sequelize.STRING,
       unique: true,
       allowNull: false
    },
    isbn13: {
       type: Sequelize.STRING,
       unique: true,
       allowNull: false
    },
    title: {
       type: Sequelize.STRING,
       allowNull: false
    },
    author: {
       type: Sequelize.STRING,
       allowNull: false
    },
    publisher: {
       type: Sequelize.STRING,
       allowNull: false
    },
    publishedDate: {
       type: Sequelize.INTEGER,
       allowNull: false,
       field: 'published_date'
    },
    edition: {
       type: Sequelize.STRING,
       allowNull: false
    },
    pageCount: {
       type: Sequelize.STRING,
       allowNull: false,
       field: 'page_count'
    },
    category: {
       type: Sequelize.STRING,
       allowNull: false
    },
    language: {
       type: Sequelize.STRING,
       field: 'book_language'
    },
    description: {
       type: Sequelize.STRING,
       field: 'book_desc'
    },
    imageLink: {
       type: Sequelize.STRING,
       unique: true,
       allowNull: false,
       field: 'image_link',
    },
    createdAt: {
       type: Sequelize.DATE,
       defaultValue: Sequelize.NOW,
       field: 'created_at'
    }
});

module.exports = Book;