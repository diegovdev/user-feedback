'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "Sessions", deps: []
 *
 **/

var info = {
    "revision": 2,
    "name": "base-session",
    "created": "2018-11-11T12:32:21.522Z",
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
