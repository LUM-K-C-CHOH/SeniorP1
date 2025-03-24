# Welcome to RTHA - Mobile App 👋

## Overview
The RTHA (Real-Time Health App) mobile app is a user-friendly application designed to streamline healthcare management. It facilitates seamless communication between caregivers and healthcare providers, ensuring efficient and effective healthcare delivery. The app is built using the **Expo framework**, leveraging the power of React Native for cross-platform development.

---

## Setup Instructions

### Prerequisites
1. **Install Android Studio**:
   - Download and install [Android Studio](https://developer.android.com/studio).
   - Set up the Android SDK and create an emulator using the Android Device Manager.

2. **Set Up Environment Variables**:
   - Register the `ANDROID_HOME` environment variable to point to your Android SDK installation path.
      - **Windows**:
         - Open Environment Variables settings via Control Panel or Start menu.
         - Add a new variable named `ANDROID_HOME` with the SDK path as its value.
      - **Mac**:
         - Add the following to your shell configuration file (e.g., `.bashrc`, `.zshrc`):
            ```
            export ANDROID_HOME='path_to_android_sdk'
            ```

3. **Clone the Repository**:
   ```
   git clone https://github.com/your-repo/rtha.git
   cd mobile
   ```

4. **Install Dependencies**:
   npm install

---

## Usage Instructions

### Running the App
- **Android**:
   npx expo run:android
   or
   npm run android
- **iOS**:
   npx expo run:ios
   or
   npm run ios
   
---

## Dependencies and System Requirements

### Requirements
- **Android Studio** and **Android SDK** (for Android development).
- **Xcode** (for iOS development).

### Dependencies
- **Expo/React Native Framework**: For cross-platform mobile app development.
- **Google Firebase Authentication Library**: For user authentication.
- **React Native Google SignIn Library**: For Google Sign-In functionality.
- **Internationalization Library (i18next)**: For multi-language support.
- **HTTP Request Library (axios)**: For making API requests.
