# WS-Product-Nodejs

WS-Product-Nodejs includes a RESTful API for users to view Intersting places (POIs) in North America and their visit statistics.

## API on Heroku

[View](https://eq-back.herokuapp.com/)

## Development

This application was developed using the following frameworks.

- [NodeJs](https://nodejs.org)
- [express](https://expressjs.com/)
- [Postgres](https://www.postgresql.org/docs/9.6/static/libpq-envars.html)

## Application Features

#### Displays stats of POIs

Users can view POI details and the events/stats per day and hour.

#### Rate-Limiting

- It implements the Leaky Bucket algorithm to limit/prevent attacks

## Setup and Installation

- Ensure that you have NodeJs installed on your machine. This server uses Node (v6.10.3)
- Clone the repository `$ https://github.com/fmustapha/ws-product-nodejs.git`
- Change into the directory `$ cd ws-product-nodejs`
- Install all required dependencies with `$ npm install` or `$ yarn install`
- Create a `.env` file in your root directory as described in `.env.sample` file

## Available Scripts and Usage

- Run `npm run dev` to start the application.<br />
  Open [http://localhost:5555](http://localhost:5555) to view it in the browser.

### `npm test`

Launches the test runner.