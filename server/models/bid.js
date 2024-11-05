'use strict';
module.exports = (sequelize, DataTypes) => {
  const Bid = sequelize.define('Bid', {
    auctionid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bidAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    }
  }, {
    timestamps: false
  });
  return Bid;
};
