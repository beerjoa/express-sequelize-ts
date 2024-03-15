<p align="center">
  <a href="https://blog.beerjoa.dev/projects/express-sequelize-ts/" target="blank" rel="noreferrer">
    <img src="https://em-content.zobj.net/source/twitter/376/toolbox_1f9f0.png" width="128" alt="express-sequelize-ts" />
  </a>
</p>
<h1 align="center">
  ESTS
</h1>
<div align="center">
  <p>
    <img src="https://img.shields.io/github/package-json/v/beerjoa/express-sequelize-ts" alt="Version" />
    <img src="https://img.shields.io/github/actions/workflow/status/beerjoa/express-sequelize-ts/node.js.yml?branch=main" alt="GitHub Actions Status" />
    <!-- <img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fbeerjoa%2Fexpress-sequelize-ts&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=false" alt="hits" /> -->
    <img src="https://img.shields.io/github/license/beerjoa/express-sequelize-ts" alt="License" />
    <img src="https://img.shields.io/github/issues/beerjoa/express-sequelize-ts" alt="Github issues" />
    <img src="https://img.shields.io/github/last-commit/beerjoa/express-sequelize-ts" alt="GitHub last commit" />
    <img src="https://img.shields.io/github/languages/top/beerjoa/express-sequelize-ts" alt="GitHub top language" />
  </p>
  <p>
    <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white" alt="Docker" />
    <img src="https://img.shields.io/badge/SQLite-003B57?style=flat&logo=sqlite&logoColor=white" alt="SQLite" />
    <img src="https://img.shields.io/badge/Sequelize-52B0E7?style=flat&logo=sequelize&logoColor=white" alt="Sequelize" />
    <img src="https://img.shields.io/badge/Jest-C21325?style=flat&logo=jest&logoColor=white" alt="Jest" />
    <img src="https://img.shields.io/badge/ESLint-4B32C3?style=flat&logo=eslint&logoColor=white" alt="ESLint" />
    <img src="https://img.shields.io/badge/Prettier-F7B93E?style=flat&logo=prettier&logoColor=white" alt="Prettier" />
  </p>
</div>

## Introduction

`ESTS (express-sequelize-ts)` is a TypeScript-based boilerplate that enables the creation of web applications using the Express framework and Sequelize ORM.

## Technology Stacks

- 🟦 [TypeScript](https://www.typescriptlang.org/docs) - A strongly typed programming language that builds on JavaScript.
- 🌐 [Node.js](https://nodejs.org/en/docs) - An asynchronous event-driven JavaScript runtime.
- 🚚 [Express](https://expressjs.com/en/4x/api.html) - A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
- 💾 [Sequelize](https://github.com/sequelize/sequelize-typescript) - A promise-based Node.js ORM tool for various Relational database.
- 📚 [TypeStack](https://github.com/typestack) - A decorator-based frameworks and libraries for Node and browser.
- 🛠 [Jest](https://jest-archive-august-2023.netlify.app/docs/29.3/getting-started/) - A delightful JavaScript Testing Framework focusing on simplicity.
- 🚧 [ESLint](https://eslint.org/docs/latest) - An open-source project that helps to find and fix problems with the project's JavaScript code.
- 🎨 [Prettier](https://prettier.io/docs/en) -  An opinionated code formatter supporting the project's code.
- 🐳 [Docker](https://docs.docker.com) - A platform designed to help developers build, share, and run container applications.

## Development Features

- 🚫 JWT authentication, to ensure secure access to the API.
- 🎢 A Layered architecture (Controller, Service, Repository, Model).
- 📦 Dependency injection for better code organization.
- 📝 Swagger for API documentation and testing.
- ♻️ Data Transport Object (DTO) to validate request and response data.

## Requirements

- Node 18.12.x
- Yarn
- SQLite (or any other database supported by Sequelize)
- Docker (optional)

## Getting Started

Run the following commands to set environment variables and install dependencies:

#### set environment variables

```bash
## set environment variables
#### make .env.{NODE_ENV} file using .env.example file
#### EX) .env.development | .env.test
$ cp .env.example .env.development
```

#### install dependencies

```bash
## install dependencies
#### using yarn
$ yarn install

#### using Docker
$ yarn docker:build
```

then, you can run locally in development and test mode:

```bash
## run locally in development and test mode
#### using yarn
$ yarn dev | test:integration | test:unit:all | test:unit {path}

#### using Docker
$ yarn docker:dev | docker:test
```

call test API endpoints:

```json
// http://localhost:3000/api
// Content-Type: application/json
{
  "message": "Hello World"
}
```

## Deploy to production

you can deploy to production using yarn or Docker:

```bash
## using yarn
$ yarn build
$ yarn start

## using Docker
$ yarn docker:prod
```

## What's next?

- [x] ~~Add unit test~~
- [x] ~~Add integration test~~
- [x] ~~Add docker-compose~~
- [x] ~~Add swagger~~
- [x] ~~Write more specific documentation~~
- [ ] Develop a new feature

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.
