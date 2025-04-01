'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('admins', 'adminId');
    await queryInterface.renameTable('admins', 'users');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameTable('users', 'admins');
    await queryInterface.addColumn('admins', 'adminId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
