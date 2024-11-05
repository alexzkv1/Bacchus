'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bid extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Bid.init({
    auctionid: DataTypes.INTEGER,
    username: DataTypes.STRING,
    highestbid: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Bid',
  });
  return Bid;
};