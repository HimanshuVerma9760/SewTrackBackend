'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('customers', 'associatedTailor', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'admins',
        key: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('customers', 'associatedTailor');
  },
};
