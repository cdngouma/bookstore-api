const Sequelize = require('sequelize');

module.exports = new Sequelize('bookstore', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

console.log('instance of Sequelize created...');