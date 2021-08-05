# node-graphql

## Table of Contents

- [node-graphql](#node-graphql)
  - [Table of Contents](#table-of-contents)
  - [General Info](#general-info)
  - [Prerequisites](#prerequisites)
  - [Node.js Dependencies](#nodejs-dependencies)
  - [Getting Started](#getting-started)
    - [Configuration](#configuration)
    - [Database](#database)
  - [Usage](#usage)
    - [Example 1](#example-1)
    - [Example 2](#example-2)

## General Info 
This project implements a GraphQL API service using Node.js + Express and a Postgres relational database as persistence.

The API documentation and tests are available [here](https://documenter.getpostman.com/view/1795836/TzshH51h) throught [Postman](https://www.postman.com).

A live version of the service is currently running on [Heroku](https://devcenter.heroku.com/) in the following URL:

```
https://node-graphql-rb.herokuapp.com/graphql
```

API is securitized by scoped access tokens through the OAuth 2.0 protocol. 
The authorization server is provided by [Okta](https://developer.okta.com).


## Prerequisites
- [Node.js](https://nodejs.org) >= 14
- [PostgreSQL](https://www.postgresql.org) >= 11


## Node.js Dependencies

- [express](https://ghub.io/express): Fast, unopinionated, minimalist web framework.
- [@okta/jwt-verifier](https://ghub.io/@okta/jwt-verifier): Easily validate Okta access tokens.
- [jsonwebtoken](https://ghub.io/jsonwebtoken): JSON Web Token implementation (symmetric and asymmetric).
- [@prisma/client](https://ghub.io/@prisma/client): Prisma Client is an auto-generated, type-safe and modern JavaScript/TypeScript ORM for Node.js that&#39;s tailored to your data. Supports MySQL, PostgreSQL, MariaDB, SQLite databases.
- [graphql](https://ghub.io/graphql): A Query Language and Runtime which can target any service.
- [express-graphql](https://ghub.io/express-graphql): Production ready GraphQL HTTP middleware.
- [graphql-tools](https://ghub.io/graphql-tools): Useful tools to create and manipulate GraphQL schemas.
- [bcrypt](https://ghub.io/bcrypt): A bcrypt library for NodeJS.
- [dotenv](https://ghub.io/dotenv): Loads environment variables from .env file.


## Getting Started

To get you started you can simply clone the repository:

```
git clone https://github.com/rboeg/node-graphql 
```
And install the Node.js dependencies:
```
npm install
```
You must provide a newly created Postgres database (and specify its connection URL as shown in the [Configuration](#configuration) section).

### Configuration

You must set the following environment variables:

.env file:
```
OKTA_CLIENT_ID='5551e0un555acynEh555'
OKTA_ISSUER='https://dev-55506555.okta.com/oauth2/default'
OKTA_AUDIENCE='api://default'
PORT=3000

DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public
```

.okta.env file:
```
export OKTA_OAUTH2_ISSUER="https://dev-55506555.okta.com/oauth2/default"
export OKTA_OAUTH2_CLIENT_ID="5551e0un555acynEh555"
export OKTA_OAUTH2_CLIENT_SECRET="5555OUrkafDSkmiS555Ndat3jNQ0YW9XmPpJ5555"
```

### Database
Run the database migrations and seed the initial data using [Prisma](https://ghub.io/@prisma/client):

```
npx prisma migrate reset
```

## Usage

Remember: The API documentation is available [here](https://documenter.getpostman.com/view/1795836/TzshH51h).

To run the server, use:

```
node index.js
```

To make requests to the API, you must first obtain a fresh scoped access token from [Okta](https://developer.okta.com):

**Request header**
```
POST /oauth2/default/v1/token HTTP/1.1
HOST: dev-13306591.okta.com
content-type: application/x-www-form-urlencoded
```

**Request body**

(Raw content)
```
grant_type=client_credentials&scope=api&client_id=5555e0un7hLacynE5555&client_secret=55555UrkafDSkmiSBkDNdat3jNQ0YW9XmPp55555
```
(Form content)
```
grant_type=client_credentials
scope=api
client_id=5555e0un7hLacynE5555
client_secret=55555UrkafDSkmiSBkDNdat3jNQ0YW9XmPp55555
```

**Sample response**
```
{
"token_type": "Bearer",
"expires_in": 4400,
"access_token": "55555WQiOiJ4eW9oVEY0TEI5c29fTUlIVGZ0dmltR1pZQldCbzFIa2hQYWxJSGdHNE5zIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULnJmOXNJbFU4ZDI3VE4wTVNPTzNHZTc1alQycFBjVVNnb0pCaVAxcjRwcWsiLCJpc3MiOiJodHRwczovL2Rldi0xMzMwNjU5MS5va3RhLmNvbS9vYXV0aDIvZGVmYXVsdCIsImF1ZCI6ImFwaTovL2RlZmF1bHQiLCJpYXQiOjE2Mjc4NDc2N55555V4cCI6MTYyNzkzNDA1NCwiY2lkIjoiMG9hMWUwdW43aExhY3luRWg1ZDciLCJzY3AiOlsiYXBpIl0sInN1YiI6IjBvYTFlMHVuN2hMYWN5bkVoNWQ3In0.Hsx8ltXqF2A3BT6gTaeOwJ8bN0Efakj_q75Lwa5BF0WODuAkwR2ufvIOYUMbWQH-NzvWhzXCYlHgpHudaUPVKOizLoAKQOvWJx1v6zakGWpVn9gZRE5j9tsSERNULDgSJc0_v37w67QdXIOYzoKRfG7Y1iKL9hsRDuuRklW5CM8Uqow_DefsCEbAU_SCqCsv9sEOxMBRPQ7uDwjCCsJFxcL86klxoyCx6RiusKOCn9iIZcQ2eUlVU0WkTaEkVEGmjFyHs_8h3h6Hsjc7SORI0hb-adjtxopsQZ6dlPYXCyABGyH4IwC6ioiSloKAP7-obaQL1eo_Y9bZ-G0xo55555",
"scope": "api"
}
```

Now, you can make successive requests to the API by providing the **access_token** in the header.

### Example 1
Requesting the **createApartment** operation:

**Request header**
```
POST /graphql HTTP/1.1
HOST: https://node-graphql-rb.herokuapp.com/graphql
content-type: application/graphql
authorization: Bearer 55555WQiOiJ4eW9oVEY0TEI5c29fTUlIVGZ0dmltR1pZQldCbzFIa2hQYWxJSGdHNE5zIiw... (the access_token obtained from the Okta authorization server)
```

**Request body**
```
mutation{
    createApartment(userId:23, title:"Apartment Number 1", description:"Description of the apartment", city:"Berlin", 
          nBedrooms:2, nBathrooms:2, areaM2:54.5, monthlyRentEUR: 2720, 
          latitude:52.520008, longitude:13.404954,  
          availableFrom:"2021-08-05T08:00:00Z")
    {
        id
    }
}
```

**Response**
```
{
  "data": {
    "createApartment": {
      "id": 2
    }
  }
}
```

### Example 2
Requesting the **apartmentsGeoLoc** query:

**Request header**
```
POST /graphql HTTP/1.1
HOST: https://node-graphql-rb.herokuapp.com/graphql
content-type: application/graphql
authorization: Bearer 55555WQiOiJ4eW9oVEY0TEI5c29fTUlIVGZ0dmltR1pZQldCbzFIa2hQYWxJSGdHNE5zIiw... (the access_token obtained from the Okta authorization server)
```

**Request body**
```
query {
    apartmentsGeoLoc (currLatitude: 52.52070477, currLongitude: 13.58748722, distanceKm: 8) {
      id
      title
      description
      city
      userId
      nBedrooms
      nBathrooms
      areaM2
      latitude
      longitude
      availableFrom
      distance
    }
}
```

**Response**
```
{
  "data": {
    "apartmentsGeoLoc": [
    {
      "id": 2,
      "title": "3-room apartment in Hellersdorf",
      "description": "Bright and quiet apartment with 2 bedrooms.",
      "city": "Berlin",
      "userId": 2,
      "nBedrooms": 2,
      "nBathrooms": 1,
      "areaM2": 49,
      "latitude": 52.54070481,
      "longitude": 13.59748723,
      "availableFrom": "2021-08-04T13:06:51.857+00:00",
      "distance": 2.3246945255435967
    },
    {
      "id": 1,
      "title": "Comfortable Studio",
      "description": "Studio in Berlin, Karlshorst",
      "city": "Berlin",
      "userId": 1,
      "nBedrooms": 1,
      "nBathrooms": 1,
      "areaM2": 25,
      "latitude": 52.48470975,
      "longitude": 13.5244499,
      "availableFrom": "2021-08-04T13:06:51.818+00:00",
      "distance": 5.852343395952332
    }
    ]
  }
}
```