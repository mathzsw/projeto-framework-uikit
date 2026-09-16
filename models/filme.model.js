const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');

const Filme = sequelize.define(
    'Filme',
    { 
        titulo: {
            type: DataTypes.STRING,
            allowNull: false},
        ano: {
            type: DataTypes.INTEGER,
            allowNull: false}
    },
    {
        tableName: 'filmes',
    }
);

module.exports = Filme;