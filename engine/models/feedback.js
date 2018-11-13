'use strict';
module.exports = function(sequelize, DataTypes) {

    const Feedback = sequelize.define('Feedback', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        rating: DataTypes.ENUM('1', '2', '3', '4', '5'),
        comment: DataTypes.STRING,
    }, {});

    Feedback.associate = function (models) {
        // associations can be defined here
        models.Feedback.belongsTo(models.User, {as: 'user', constraints: true });
        models.Feedback.belongsTo(models.Session, {as: 'session', constraints: true });
    };

    return Feedback;
};