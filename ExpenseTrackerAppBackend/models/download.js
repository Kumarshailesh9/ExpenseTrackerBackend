const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Download = sequelize.define('download', {
    fileURL: {
        type: Sequelize.STRING,
        allowNull: false
    }
});


module.exports = Download;