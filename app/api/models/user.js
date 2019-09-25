const Sequelize = require('sequelize');
const db = require('../../config/database');

const User = db.define('user', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    username: {
       type: Sequelize.STRING,
       unique: true,
       allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        field: 'user_email',
        validate: {
            isEmail: true
        }
    },
    password: {
       type: Sequelize.STRING,
       allowNull: false,
       field: 'user_password'
    },
    createdAt: {
       type: Sequelize.DATE,
       defaultValue: Sequelize.NOW,
       field: 'created_at'
    },
    lastLoggedIn: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        field: 'last_accessed'
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        field: 'last_modified'
    }
});

module.exports = User;