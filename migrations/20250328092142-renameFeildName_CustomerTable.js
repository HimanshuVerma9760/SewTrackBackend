'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('customers', 'cutomerId', 'customerId');
  },

  async down(queryInterface, Sequelize) {},
};
