# FastAPI Firebase Firestore API Documentation

## Overview
This API is built with FastAPI and integrates with Firebase Firestore for storing and managing user data, medications, appointments, and settings. The API supports user authentication using Firebase Authentication and provides CRUD operations for managing resources.

## Base URL
```
http://127.0.0.1:8000
```

## Authentication
All endpoints require authentication via Firebase ID tokens. Include the token in the `Authorization` header:

```
Authorization: Bearer <firebase_id_token>
```

## Endpoints

### User Management
#### Register User
**POST** `/users/register`

**Request Body:**
```json
{
  "uid": "string",
  "email": "string",
  "name": "string"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "uid": "string",
    "email": "string",
    "name": "string"
  }
}
```

#### Get User Details
**GET** `/users/{uid}`

**Response:**
```json
{
  "uid": "string",
  "email": "string",
  "name": "string"
}
```

### Medication Management
#### Add Medication
**POST** `/medications/`

**Request Body:**
```json
{
  "uid": "string",
  "name": "string",
  "dosage": "string",
  "frequency": "string"
}
```

**Response:**
```json
{
  "message": "Medication added successfully"
}
```

#### Get Medications
**GET** `/medications/{uid}`

**Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "dosage": "string",
    "frequency": "string"
  }
]
```

### Appointment Management
#### Add Appointment
**POST** `/appointments/`

**Request Body:**
```json
{
  "uid": "string",
  "date": "string",
  "time": "string",
  "doctor": "string"
}
```

**Response:**
```json
{
  "message": "Appointment added successfully"
}
```

#### Get Appointments
**GET** `/appointments/{uid}`

**Response:**
```json
[
  {
    "id": "string",
    "date": "string",
    "time": "string",
    "doctor": "string"
  }
]
```

### Settings Management
#### Update Settings
**POST** `/settings/`

**Request Body:**
```json
{
  "uid": "string",
  "notifications": true
}
```

**Response:**
```json
{
  "message": "Settings updated successfully"
}
```

#### Get Settings
**GET** `/settings/{uid}`

**Response:**
```json
{
  "notifications": true
}
```

## Error Responses
- `401 Unauthorized` - Invalid or missing authentication token.
- `404 Not Found` - Resource not found.
- `500 Internal Server Error` - Unexpected server error.

## Notes
- Ensure you provide a valid Firebase ID token in the `Authorization` header.
- Firestore rules should be configured to allow secure access to user data.

---
**Author:** Morgan Thornton  
**Version:** 1.0  
**Last Updated:** 2025-04-01