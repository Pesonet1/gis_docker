# GIS Docker

Build and run Docker containers (geoserver, database, mapproxy, nginx)

`docker-compose -f docker-compose.dev.yaml up --build`

## Containers

### Nginx

Port 80

```
/geoserver -> geoserver:8080
/mapproxy -> mapproxy:8083
```

### Geoserver (Tomcat)

- 8080:8080

### MapProxy

- <>:8083

### Database (PostgresSQL)

- 5435:5432


## Client (Vue CLI)

Inner port 8082

## Server (Node + Express)

Inner port 8085

### Sequelize

Install sequelize-cli

```
$ npm install --save-dev sequelize-cli
```

This project is initialized with sequelize-cli init command

```
$ npx sequelize-cli init
```

It creates config, migrations, models, seeders folders automatically

#### Creating models

Generate skeleton model

```
$ npx sequelize-cli migration:generate --name migration-skeleton
```

Generate model with attributes

```
$ npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string
```

#### Running migrations

```
$ npx sequelize-cli db:migrate
```

Revert to latest migration

```
$ npx sequelize-cli db:migrate:undo
```

Revert to specific migration

```
$ npx sequelize-cli db:migrate:undo:all --to XXXXXXXXXXXXXX-create-posts.js
```

Revert all migrations

```
$ npx sequelize-cli db:migrate:undo:all
```

#### Seeding

Create seed file with name

```
$ npx sequelize-cli seed:generate --name demo-user
```

Set seeding content by defining created file. Always remember to fill down seeding correctly so that we can revert seedings.

```
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      firstName: 'John',
      lastName: 'Doe',
      email: 'example@example.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
```

Run all seeds

```
$ npx sequelize-cli db:seed:all
```

Reverting recent seed

```
$ npx sequelize-cli db:seed:undo
```

Undo specific seed

```
$ npx sequelize-cli db:seed:undo --seed name-of-seed-as-in-data
```

Undo all seeds

```
$ npx sequelize-cli db:seed:undo:alls
```
