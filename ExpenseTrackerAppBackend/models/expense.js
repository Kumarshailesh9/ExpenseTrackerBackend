const Sequelize = require('sequelize');
const sequelize = require('../util/database');


const Expense = sequelize.define('expense' , {
    price: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    des: {
        type: Sequelize.STRING,
        allowNull: false
    },
    category:  {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Expense;