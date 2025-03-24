# Welcome to RTHA - Backend 👋

## Overview
The Real-Time Health App (RTHA) Backend provides RESTful APIs for the mobile app, enabling CRUD operations on the Google Firestore Database and SMS functionalities via the Twilio API. Built using the FastAPI framework, it ensures efficient and scalable backend services.

---

## Setup Instructions

1. **Set Up the Virtual Environment**:
   - Open a terminal in the backend project directory.
   - Run the following commands:
     ```bash
     python -m venv venv
     ./.venv/Scripts/Activate  # Use `source venv/bin/activate` on Mac/Linux
     ```

2. **Install Dependency Packages**:
   ```bash
   pip install -r requirements.txt
   ```

---

## Usage Instructions
- **Run the Backend Server**:
  ```bash
  fastapi dev main.py
  ```

---

## Dependencies and System Requirements

### Requirements
- Python 3.10 or higher.

### Dependencies
- **Google Firebase Admin SDK**: For cross-platform mobile app development.
- **Twilio SDK**: For user authentication.
