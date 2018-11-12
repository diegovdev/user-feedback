'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        var sessions = [];
        for(let i = 2001; i <= 2030; i++) {
            let endDate = new Date();
            endDate.setDate(endDate.getDate() + 1);
            var id = 'session-' + i;
            sessions.push({
                id: id,
                gameId: 'ubigame-3456',
                startDate: new Date(),
                endDate: endDate,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
        return queryInterface.bulkInsert('Sessions', sessions, {});
    },


    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Sessions', null, {});
    }
};
