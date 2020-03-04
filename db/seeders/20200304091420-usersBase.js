'use strict';
// require('app-module-path').addPath(__dirname + '/..'); //This allows application-level modules to be required as if they were installed into the node_modules directory.

var MODELS = require('../../models/index');
module.exports = {
  up: (queryInterface, Sequelize, done) => {
    return MODELS.sequelize.transaction((t) => {
        let userData = {
          username: 'normalUser',
          password: '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8', // password = password en sha1
          email: 'user@usermail.fr',
          firstname: 'Normal',
          lastname: 'User',
          role: 'normalUser'
        };
        return MODELS.user.create(userData, {
            transaction: t
          })
          .then(() => {
            let adminData = {
              username: 'admin',
              password: '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8', // password = password en sha1
              email: 'admin@usermail.fr',
              firstname: 'Administrateur',
              lastname: 'API',
              role: 'admin'
            };
            return MODELS.user.create(adminData, {
              transaction: t
            }).then(() => {
              done();
            });
          });
      })
      .catch((e) => {
        console.log(e);
      });
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
