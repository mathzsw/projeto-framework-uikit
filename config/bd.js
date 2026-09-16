const Sequelize = require('sequelize');

const sequelize = new Sequelize ({
    dialect: 'sqlite',
    storage: './bancoDeDados.sqlite'
});

module.exports = sequelize;