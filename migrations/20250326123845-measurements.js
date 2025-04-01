'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('measurements', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'customers',
          key: 'id',
        },
      },
      shoulder: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      chest: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      waist: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      hip: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      sleeve_length: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      neck: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('measurements');
  },
};
