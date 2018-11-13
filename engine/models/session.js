'use strict';
module.exports = function(sequelize, DataTypes) {

    const Session = sequelize.define('Session', {
        id: { type: DataTypes.STRING, primaryKey: true },
        gameId: { type: DataTypes.STRING, defaultValue: 'some-game-id' },
        startDate: DataTypes.DATE,
        endDate: DataTypes.DATE,
    }, {});

    Session.associate = function (models) {
        // associations can be defined here
    };

    return Session;
};