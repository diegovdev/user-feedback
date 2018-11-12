'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "Feedbacks", deps: [Users, Sessions]
 *
 **/

var info = {
    "revision": 3,
    "name": "base-feedback",
    "created": "2018-11-11T12:32:31.997Z",
    "comment": ""
};

var migrationCommands = [{
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
}];

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
