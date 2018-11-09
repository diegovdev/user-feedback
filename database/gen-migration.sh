#!/usr/bin/env bash

MIGRATION_BASE_NAME=$1

if [ $# -eq 0 ]
  then
    MIGRATION_BASE_NAME='feedbackdb'
fi

node ./node_modules/sequelize-auto-migrations/bin/makemigration \
    --migrations-path 'database/migrations' \
    --models-path 'lib/models' \
    --name $MIGRATION_BASE_NAME