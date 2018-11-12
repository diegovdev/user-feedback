'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        var users = [];
        for(let i = 1001; i <= 1030; i++) {
            var id = 'user-' + i;
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
