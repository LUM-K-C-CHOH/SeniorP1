# RTHA API Documentation

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

### Medication

#### Get Medication List
**GET** `/medication/{user_id}`
- Retrieves the list of medications for a user.

#### Add Medication
**PUT** `/medication/add`
- Adds a new medication.
- **Body** (JSON):
  ```json
  {
    "id": 1,
    "user_id": "user123",
    "name": "Aspirin",
    "image": "image_url",
    "stock": 20,
    "start_date": "2025-04-01",
    "end_date": "2025-04-30",
    "stock_date": "2025-03-31",
    "threshold": 5,
    "push_alert": "on",
    "email_alert": "on"
  }
  ```

#### Update Medication
**PUT** `/medication/update`
- Updates an existing medication.

#### Update Multiple Medications
**PUT** `/medication/update/list`
- Updates multiple medications for a user.

#### Delete Medication
**DELETE** `/medication/{user_id}/{medication_id}`
- Deletes a medication entry.

### Medication Frequency

#### Get Medication Frequency List
**GET** `/medication/frequency/{user_id}`
- Retrieves the frequency list for medications.

#### Add Medication Frequency
**PUT** `/medication/frequency/add`
- Adds a new frequency for a medication.

#### Update Medication Frequency
**PUT** `/medication/frequency/update`
- Updates a medication frequency.

#### Update Multiple Medication Frequencies
**PUT** `/medication/frequency/update/list`
- Updates multiple medication frequencies.

#### Delete Medication Frequency
**DELETE** `/medication/frequency/{user_id}/{frequency_id}`
- Deletes a frequency entry.

### Appointment

#### Get Appointment List
**GET** `/appointment/{user_id}`
- Retrieves the list of appointments for a user.

#### Add Appointment
**POST** `/appointment`
- Adds a new appointment.

#### Update Appointment
**PUT** `/appointment`
- Updates an existing appointment.

#### Update Multiple Appointments
**PUT** `/appointment/list`
- Updates multiple appointments.

#### Delete Appointment
**DELETE** `/appointment/{user_id}/{appointment_id}`
- Deletes an appointment entry.

### User Settings

#### Get User Settings
**GET** `/user/setting/{user_id}`
- Retrieves user settings.

#### Update User Settings
**PUT** `/user/setting`
- Updates user settings.

### Emergency Contact

#### Get Emergency Contact List
**GET** `/emergency/contact/{user_id}`
- Retrieves the emergency contact list for a user.

#### Update Emergency Contact
**PUT** `/emergency/contact/update`
- Updates an emergency contact.

#### Update Multiple Emergency Contacts
**PUT** `/emergency/contact/update/list`
- Updates multiple emergency contacts.

#### Delete Emergency Contact
**DELETE** `/emergency/contact/{user_id}`
- Deletes emergency contacts based on the provided list.
- **Body** (JSON):
  ```json
  {
    "contactList": "[\"contact1\", \"contact2\"]"
  }
  ```

### Notification

#### Get Notification List
**GET** `/notification/{user_id}`
- Retrieves the notification list for a user.

#### Update Notification
**PUT** `/notification/update`
- Updates a notification.

#### Update Multiple Notifications
**PUT** `/notification/update/list`
- Updates multiple notifications.

### Emergency Alert

#### Send Emergency Alert
**POST** `/sendEmergency`
- Sends an emergency alert.
- **Body** (JSON):
  ```json
  {
    "emergencyData": ["data1", "data2"],
    "currentAddress": ["address1", "address2"]
  }
  ```

### Email Notification

#### Send Medication Email Alert
**POST** `/medication/sendEmail`
- Sends a medication reminder via email.
- **Body** (JSON):
  ```json
  {
    "user_name": "John Doe",
    "to_email": "john@example.com",
    "medication_name": "Aspirin"
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
