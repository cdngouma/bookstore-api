const Sequelize = require('sequelize');
const shortUUID = require('shortid');
const sequelize = require('../../config/database');

class Book extends Sequelize.Model { }

Book.init({
   id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: shortUUID.generate(),
      field: 'book_id'
   },
   author: { type: Sequelize.STRING, allowNull: false, field: 'author' },
   isbn10: { type: Sequelize.STRING, unique: true },
   isbn13: { type: Sequelize.STRING, unique: true },
   title: { type: Sequelize.STRING, allowNull: false },
   category: { type: Sequelize.STRING, allowNull: false },
   edition: Sequelize.STRING,
   publisher: { type: Sequelize.STRING, allowNull: false },
   year: { type: Sequelize.INTEGER, allowNull: false, field: 'published_date' },
   pageCount: { type: Sequelize.STRING, allowNull: false, field: 'page_count' },
   language: Sequelize.STRING,
   description: Sequelize.STRING,
   imageLink: { type: Sequelize.STRING, unique: true, allowNull: false, field: 'image_link' },
   createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW, field: 'created_at' }
},
{
   sequelize,
   timestamps: false,
   modelName: 'book',
   tableName: 'books',
   freezeTableName: true
});

module.exports = Book;