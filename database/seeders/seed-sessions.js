'use strict';

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

module.exports = {
    up: (queryInterface, Sequelize) => {
        var users = [];
        for(let i = 5501; i <= 5530; i++) {
            let endDate = new Date();
            endDate.setDate(endDate.getDate() + 1);
            var id = 'session-' + pad(i, 4);
            users.push({
                id: id,
                gameId: 'ubigame-3456',
                startDate: new Date(),
                endDate: endDate,
                createdAt: new Date(),
                updatedAt: new Date()

            });
        }
        return queryInterface.bulkInsert('Sessions', users, {});
    },


    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Sessions', null, {});
    }
};
