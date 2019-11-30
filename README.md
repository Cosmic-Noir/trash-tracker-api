# Trash#Tracker API

This is the API for Trash#Tracker's client-side React app.

## Resource Description

Contains information about user info, user comments, and reported trash sites and cleaned sites.

## Getting Started

## Authentication Requirements

POST requests to the API require an Authorization header in the following format with a server-issued JWT.

Authorization: "Bearer {JSON-Web-Token}"

## Endpoints and Methods

### /sites/ Endpoint

```
GET sites/
```

Get all reported sites in the database.

GET sites/trash/

Get all reported Trash Sites in the database.

GET sites/clean/

Get all reported Cleaned Sites in the database.

POST sites/

Post a new Trash Site to the database.

### /sites/:site_id/ Endpoint

GET sites/:site_id/

Get a site with matching ID.

PATCH sites/:site_id/

Patch a Trash Site to update into a Cleaned Site.

### /sites/:site_id/comments/ Endpoint

GET sites/:site_id/comments/

Get all comments associated with specified site.

### /users/ Endpoint

POST /users/

Post new user information to database

### /login/ Endpoint

POST /login/

Post submitted user login information, validates against database, returns JSON Web Token if validated.

### /comments/ Endpoint

POST /comments/

Post a comment to the database.

## Parameters

### Header Parameters

## Request Example

## Response Example and Schema
