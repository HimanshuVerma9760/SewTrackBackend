'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      'Appointments',
      'delieveryDate',
      'deliveryDate',
    );
  },

  async down(queryInterface, Sequelize) {},
};
