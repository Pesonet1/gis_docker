# GIS Docker

Build and run Docker containers (geoserver, database, mapproxy, nginx)

`docker-compose -f docker-compose.dev.yaml up --build`

## Containers

Nginx 80:80
Geoserver 8080:8080
Database 5435:5432
Mapproxy :8083

### Nginx

Following proxying is used for Geoserver & Mapproxy

```
/geoserver -> geoserver:8080
/mapproxy -> mapproxy:8083
```

### Geoserver (Tomcat)

Geoserver has kunnat_2019 geopackage automatically configured.

TODO More configuration needed

### MapProxy

Mapproxy is used for serving base map for client app. It loads, seeds & proxies a background map from kartat.kapsi tiles.

By default mapproxy seeding process is not run. It needs to be run manually with following command inside container.

```
$ su $USER_NAME -c "mapproxy-seed -f mapproxy.yaml -s seed.yaml --progress-file .mapproxy_seed_progress"
```

### Database (PostgresSQL)

TODO

## Client (Vue CLI)

Client app can be started with following command

```
$ yarn run serve
```

App is opened on localhost for port 8082


## Server (Node + Express)

Server can be start by running following command

```
$ npm run start
```

Server listens to port 8085 on localhost. Server listens automatically to file changes by using nodemon.

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
