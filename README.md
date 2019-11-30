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

POST /comments - Request sent as JSON with the following parameters.

| Parameter |  Type   |
| :-------: | :-----: |
|  site_id  | integer |
|  content  | string  |
| user_ref  | integer |

Example Request Body:

```
{ site_id: 13,
  content:
   'Woa, I\'d love to help since this hasn\'t been cleaned yet! Let me know if you\'re all still interested. ',
  user_ref: 12 }
```

PATCH /sites/:site_id - Request sent as Form-data with below parameters and values appended.

Example Request Body:

| Parameter |  Type   |
| :-------: | :-----: |
|  content  | string  |
|   clean   | boolean |

```
body:
   [Object: null prototype] { content: 'dfhdfh', clean: 'true' },
  file:
   { fieldname: 'after_img',
     originalname: 'clean1.jpg',
     encoding: '7bit',
     mimetype: 'image/jpeg',
     destination: '/tmp',
     filename: '2019-11-30T20:55:13.560Zclean1.jpg',
     path: '/tmp/2019-11-30T20:55:13.560Zclean1.jpg',
     size: 254252 } }
```

## Response Example and Schema

### GET /sites/trash

Ex Request: <em>https://fathomless-sierra-82385.herokuapp.com/api/trash</em>

Response:

```
[
    {
        "id": 4,
        "posted_by": 2,
        "date_posted": "2019-10-28T04:09:27.858Z",
        "title": "Leech Lake",
        "addrss": "Leech Lake Park",
        "city": "Brainerd",
        "state_abr": "MN",
        "before_img": "https://www.pasadenastarnews.com/wp-content/uploads/2019/06/LDN-L-HOMELESS-COUNT-SGVN-0605-12-SR2.jpg?w=525",
        "after_img": "",
        "content": "So sad to see this beech absolutely trashed by parties and picknickers. Would be wonderful to bring my kids here again if we cleaned it up, but I could really use some help, along with a truck to haul away the refuse.",
        "clean": false
    },
    {
        "id": 13,
        "posted_by": 7,
        "date_posted": "2019-11-06T09:58:35.976Z",
        "title": "Littered Swamp",
        "addrss": "456 Heath Road",
        "city": "Little Tampa",
        "state_abr": "FL",
        "before_img": "https://cdn.cnn.com/cnnnext/dam/assets/160706124115-hong-kong-trash-03-super-169.jpg",
        "after_img": null,
        "content": "Swamp used to be used for partying, now the animals are chocking on plastic. Thinking of cleaning this up this weekend if anyone can help!",
        "clean": false
    }
]
```

### GET /sites/:site_id

Ex Request: <em>https://fathomless-sierra-82385.herokuapp.com/api/sites/3</em>

Response:

```
{
    "id": 3,
    "posted_by": 1,
    "date_posted": "2019-10-28T04:09:27.858Z",
    "title": "Ditch Off Highway 25",
    "addrss": "Highway 25 & Madison Exit",
    "city": "Fort Collins",
    "state_abr": "CO",
    "before_img": "http://nykography.weebly.com/uploads/1/1/0/4/11041387/9292659_orig.jpg",
    "after_img": "https://res.cloudinary.com/trash-tracker/image/upload/v1574789019/n3dn4hgoguiaretgdljm.jpg",
    "content": "Yay we did it! ",
    "clean": true,
    "username": "starman"
}
```

### POST /login

Ex Request: <em>https://fathomless-sierra-82385.herokuapp.com/api/login</em>

Response:

```
{authToken: {server-generated-JWT}}
```
