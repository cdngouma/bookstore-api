const Sequelize = require('sequelize');
const db = require('../config/database');
const User = require('./user');

const Merchant = db.define('merchant', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    userId: {
       type: Sequelize.STRING,
       field: 'user_id',
       references: {
           model: User,
           key: 'id'
       }
    },
    firstName: {
       type: Sequelize.STRING,
       allowNull: false,
       field: 'first_name'
    },
    lastName: {
       type: Sequelize.STRING,
       allowNull: false,
       field: 'last_name'
    },
    dateOfBirth: {
       type: Sequelize.DATE,
       allowNull: false,
       field: 'date_of_birth'
    },
    gender: {
       type: Sequelize.STRING
    },
    street: {
       type: Sequelize.STRING,
       allowNull: false
    },
    apt: {
       type: Sequelize.STRING,
       allowNull: false
    },
    city: {
       type: Sequelize.STRING,
       allowNull: false
    },
    state: {
       type: Sequelize.STRING,
       allowNull: false
    },
    zipCode: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'zip_code'
     },
    country: {
       type: Sequelize.STRING,
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

module.exports = Merchant;