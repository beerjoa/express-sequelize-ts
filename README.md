# express-sequelize-ts

[![node.js Actions Status](https://github.com/beerjoa/express-sequelize-ts/workflows/nodejs-master/badge.svg)](https://github.com/beerjoa/express-sequelize-ts/actions)

A TypeScript-based boilerplate project for creating a web application using the Express framework and the Sequelize ORM.

## Features

- [Typescript](https://www.typescriptlang.org/docs/)
  > JavaScript with syntax for types.
- [sequelize-typescript](https://www.jsdocs.io/package/sequelize-typescript)
  > Node.js ORM for Oracle, Postgres, MySQL, MariaDB, SQLite and SQL Server, and more. Featuring solid transaction support, relations, eager and lazy loading, read replication and more.
- [SQLite](https://www.postgresql.org/docs)

  > C-language library that implements a small, fast, self-contained, high-reliability, full-featured, SQL database engine.

- [Docker](https://www.docker.com/)
  > Docker is a set of platform as a service products that use OS-level virtualization to deliver software in packages called containers.

## Requirements

- Node.js
- Yarn
- SQLite (or any other database supported by Sequelize)
- Docker (optional)

## Usage

### Set Env.

```bash
### make .env.{NODE_ENV} file using .env.example file
### EX) .env.development | .env.test
$ cp .env.example .env.development
```

### Install

```bash
### using yarn
$ yarn
```

### Run

```bash
### using docker
$ yarn docker:dev | docker:prod | docker:test

### using yarn
$ yarn dev | prod | test:e2e | test:unit:all | test:unit {path}
```

### Test

```bash
### using docker
$ yarn docker:test

### using yarn
$ yarn test:unit:all | test:unit {path}
```

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/beerjoa/express-sequelize-ts/blob/main/LICENSE.md) file for details.
