'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "Sessions", deps: []
 * createTable "Users", deps: []
 * createTable "Feedbacks", deps: [Users, Sessions]
 *
 **/

var info = {
    "revision": 1,
    "name": "base",
    "created": "2018-11-10T15:06:49.415Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "createTable",
        params: [
            "Sessions",
            {
                "id": {
                    "type": Sequelize.STRING,
                    "primaryKey": true
                },
                "gameId": {
                    "type": Sequelize.STRING,
                    "defaultValue": "some-game-id"
                },
                "startDate": {
                    "type": Sequelize.DATE
                },
                "endDate": {
                    "type": Sequelize.DATE
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Users",
            {
                "id": {
                    "type": Sequelize.STRING,
                    "primaryKey": true
                },
                "email": {
                    "type": Sequelize.STRING
                },
                "nickname": {
                    "type": Sequelize.STRING
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Feedbacks",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "autoIncrement": true,
                    "primaryKey": true
                },
                "rating": {
                    "type": Sequelize.ENUM('1', '2', '3', '4', '5')
                },
                "comment": {
                    "type": Sequelize.STRING
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "allowNull": false
                },
                "userId": {
                    "type": Sequelize.STRING,
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "Users",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "sessionId": {
                    "type": Sequelize.STRING,
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "Sessions",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {}
        ]
    }
];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
