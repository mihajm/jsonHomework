## Description

An api, which consumes medical JSON data & stores it in a docker created postgres database.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# run in watch mode
$ docker compose up -d
$ npm run start:dev


# Information

Swagger documentation is available at localhost:3000/docs/ once watch mode has started.

The API is accessible on 3 endpoints /api/doctor/ /api/patient/ & /api/disease/