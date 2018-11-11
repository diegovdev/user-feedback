'use strict';

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

module.exports = {
    up: (queryInterface, Sequelize) => {
        var users = [];
        for(let i = 1; i <= 30; i++) {
            var id = 'user-' + pad(i, 4);
            users.push({
                id: id,
                email: id+'@ubi.soft',
                nickname: id,
                createdAt: new Date(),
                updatedAt: new Date()

            });
        }
        return queryInterface.bulkInsert('Users', users, {});
    },


    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users', null, {});
    }
};
