'use strict';

const bcrypt = require('bcrypt');
const { v4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('something', 10);

    await queryInterface.bulkInsert('admins', [
      {
        fullname: 'Himanshu verma',
        phoneNumber: '7818906656',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        adminId: v4(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('admins', { phoneNumber: '7818906656' });
  },
};
