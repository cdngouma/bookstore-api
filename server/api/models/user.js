const shortUUID = require('shortid');
const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

class User extends Sequelize.Model {}

User.init({
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        defaultValue: shortUUID.generate(),
        field: 'user_id'
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
    username: { type: Sequelize.STRING, unique: true, allowNull: false },
    password: { type: Sequelize.STRING, allowNull: false, field: 'user_password' },
    createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW, field: 'created_at' }
},
{
    sequelize,
    timestamps: false,
    modelName: 'user',
    tableName: 'users',
    freezeTableName: true
});

module.exports = User;