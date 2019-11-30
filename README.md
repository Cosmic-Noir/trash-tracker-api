# Trash#Tracker API

This is the API for Trash#Tracker's client-side React app.

[Live Client](https://trash-tag-tracker-app.cosmicnoir.now.sh/)
<br />[Client Repo](https://github.com/Cosmic-Noir/trash-tag-tracker-app)

## Resource Description

Contains information about user info, user comments, and reported trash sites and cleaned sites.

## Getting Started

Source URL:

```
https://fathomless-sierra-82385.herokuapp.com/api
```

## Authentication Requirements

POST requests to the API require an Authorization header in the following format with a server-issued JWT.

```
Authorization: "Bearer {JSON-Web-Token}"
```

## Endpoints and Methods

### /sites Endpoint

```
GET /sites
```

Get all reported sites in the database.

```
GET /sites/trash
```

Get all reported Trash Sites in the database.

```
GET /sites/clean
```

Get all reported Cleaned Sites in the database.

```
POST /sites
```

Post a new Trash Site to the database.

### /sites/:site_id Endpoint

```
GET /sites/:site_id
```

Get a site with matching ID.

```
PATCH /sites/:site_id
```

Patch a Trash Site to update into a Cleaned Site.

### /sites/:site_id/comments Endpoint

```
GET /sites/:site_id/comments
```

Get all comments associated with specified site.

### /users Endpoint

```
POST /users
```

Post new user information to database

### /login Endpoint

```
POST /login
```

Post submitted user login information, validates against database, returns JSON Web Token if validated.

### /comments Endpoint

```
POST /comments
```

Post a comment to the database.

## Parameters

### Request Body Parameters and Examples

POST /sites - Request sent as Form-data with below parameters and values appended.

| Parameter |  Type  |
| :-------: | :----: |
|   title   | string |
|  addrss   | string |
|   city    | string |
| state_abr | string |
|  content  | string |

Example Request Body:

```
body:
   [Object: null prototype] {
     title: 'TESTING TESTINGS',
     addrss: '123 Fake St',
     city: 'Seattle',
     state_abr: 'WA',
     content: 'Testing' },
  file:
   { fieldname: 'before_img',
     originalname: 'trash1.jpg',
     encoding: '7bit',
     mimetype: 'image/jpeg',
     destination: '/tmp',
     filename: '2019-11-30T20:23:38.103Ztrash1.jpg',
     path: '/tmp/2019-11-30T20:23:38.103Ztrash1.jpg',
     size: 729676 } }
```

POST /users - Request sent as JSON with the following parameters

| Parameter |  Type  |
| :-------: | :----: |
| username  | string |
|   pass    | string |
|   email   | string |

Example Request Body:

```
{ username: 'newUser',
  email: 'someemail@gmail.com',
  pass: 'Pass123!' }
```

POST /login - Request sent as JSON with the following parameters.

| Parameter |  Type  |
| :-------: | :----: |
| username  | string |
|   pass    | string |

Example Request Body:

```
{ pass: 'somePass12!', username: 'someUser12' }
```

POST /comments

PATCH /sites/:site_id

## Request Example

## Response Example and Schema
