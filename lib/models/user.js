'use strict';
module.exports = function(sequelize, DataTypes) {
    const User = sequelize.define('User', {
        userId: DataTypes.INTEGER,
        email: DataTypes.STRING,
        nickname: DataTypes.STRING,
    }, {});
    User.associate = function (models) {
        // associations can be defined here
    };
    return User;
};