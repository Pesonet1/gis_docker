#!/bin/bash

echo "Running Sequelize migrations"

npx sequelize-cli db:migrate

echo "Running Sequelize seeds"

npx sequelize-cli db:seed:all
