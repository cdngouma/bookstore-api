const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const User = require('./user');

class UserInfo extends Sequelize.Model {}

UserInfo.init({
    userId: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'user_id',
        references: {
            model: User,
            key: 'id'
        }
    },
    firstName: { type: Sequelize.STRING, allowNull: false, field: 'first_name' },
    lastName: { type: Sequelize.STRING, allowNull: false, field: 'last_name' },
    dateOfBirth: { type: Sequelize.DATE, allowNull: false, field: 'date_of_birth' },
    gender: { type: Sequelize.STRING },
    updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW(), field: 'updated_at' }
},
{
    sequelize,
    timestamps: false,
    modelName: 'personalInfo',
    tableName: 'users_info',
    freezeTableName: true
});
// removes generic 'id' column
UserInfo.removeAttribute('id');

User.hasOne(UserInfo);

module.exports = UserInfo;