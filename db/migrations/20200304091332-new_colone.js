'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return Promise.all([
      queryInterface.changeColumn(
          'users', // table name
          'password', // col name
          {
              type: Sequelize.INTEGER,
              allowNull: false,
              defaultValue: 0
          }
      ),
      queryInterface.addColumn(
        'users',
        'average',
        {
            type: Sequelize.DECIMAL(4, 2),
            allowNull: true
        }
      )
    ]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return Promise.all([
      queryInterface.changeColumn(
          'users',
          'password',
          {
              type: Sequelize.STRING,
              allowNull: false,
              defaultValue: false,
          }
      ),
      queryInterface.removeColumn(
        'users',
        'average'
      )
    ]);
  }
};
