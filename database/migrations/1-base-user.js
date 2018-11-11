'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "Users", deps: []
 *
 **/

var info = {
    "revision": 1,
    "name": "base-user",
    "created": "2018-11-11T12:32:01.472Z",
    "comment": ""
};

var migrationCommands = [{
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
