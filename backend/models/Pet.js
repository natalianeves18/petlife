const Sequelize = require('sequelize');
const db = require('./db');

const Pet = db.define('pets', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    race: {
        type: Sequelize.STRING,
        allowNull: false
    },
    birthday: {
        type: Sequelize.DATE,
        allowNull: true
    }
})

// Se não existir essa Tabela
//Pet.sync();
// Pet.sync({ alter: true }); // Verifica se tem mudanca na tabela e realiza alteracao
module.exports = Pet;