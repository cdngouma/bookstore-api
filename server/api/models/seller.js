const Sequelize = require('sequelize');
const sequelize = require('../../config/database');
const shortUUID = require('shortid');

const User = require('./user');

class Seller extends Sequelize.Model { }

Seller.init({
   id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: shortUUID.generate(),
      field: 'seller_id'
   },
   userId: {
      type: Sequelize.STRING,
      field: 'user_id',
      allowNull: false,
      references: {
         model: User,
         key: 'id'
      }
   },
   verified: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
   createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW, field: 'created_at' }
},
{
   sequelize,
   timestamps: false,
   modelName: 'seller',
   tableName: 'sellers',
   freezeTableName: true
});

Seller.hasOne(User);

module.exports = Seller;