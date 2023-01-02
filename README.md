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

## Requirements

- Node.js
- Yarn
- SQLite (or any other database supported by Sequelize)

## Usage

### Install

```bash
### make .env.{NODE_ENV} file using .env.example file
### EX) .env.development | .env.test
$ cp .env.example .env.development

### To install
$ yarn
```

### Run

```bash
### run dev app
$ yarn dev
```

### Test

```bash
### make .env.test file

### run e2e test
$ yarn test:e2e

### run unit test
$ yarn test:unit

```

## Reference

-
