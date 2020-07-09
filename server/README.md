# Server (Node + Express)

## Running

```
$ npm install
$ npx sequelize-cli db:migrate
$ npx sequelize-cli db:seed:all
$ npm run start
```

Server listens to port 8085 on localhost. Server listens file changes automatically by using nodemon.

### OIDC (provider)

Server contains an OIDC provider that acts as an authorization server (node-oidc-provider). It is used for authenticating users for client application.

TODO

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
