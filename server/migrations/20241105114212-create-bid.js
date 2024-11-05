'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bids', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      auctionid: {
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING
      },
      highestbid: {
        type: Sequelize.FLOAT
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Bids');
  }
};