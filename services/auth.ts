/**
 * Auth Service
 * RTHA
 * 
 * Created by Thornton on 01/23/2025
 */
import { useState  } from 'react';
import axiosInstance from './instance';
import { Alert } from 'react-native';
import { createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword  } from 'firebase/auth';
import { auth, firestore} from '@/config/firebaseConfig';
import { useRouter } from 'expo-router';
import { doc, setDoc } from "firebase/firestore";

// export const login = (email: string, password: string) => {
//   return axiosInstance.post(
//     '/auth/login',
//     {
//       email,
//       password
//     },
//   )
//     .then(response => {
//       if (response.data.code === 0) {
//         return { success: true, data: response.data.data };
//       } else {
//         return { success: false, message: response.data.error };
//       }
//     })
//     .catch(error => {
//       console.error(error);
//       return { success: false, message: error.message };
//     });
// }

// export const register = (
//   name: string,
//   email: string,
//   countryCode: string,
//   phone: string,
//   password: string
// ) => {
//   return axiosInstance.post(
//     '/auth/register',
//     {
//       name,
//       email,
//       password,
//       countryCode,
//       phone
//     },
//   )
//     .then(response => {
//       if (response.data.code === 0) {
//         return { success: true, data: response.data.data };
//       } else {
//         return { success: false, message: response.data.error };
//       }
//     })
//     .catch(error => {
//       console.error(error);
//       return { success: false, message: error.message };
//     });
// }


export const login = async (
  email: string,
  password: string
) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const data = {
      id: userCredential.user.uid,
      name: userCredential.user.displayName,
      email: userCredential.user.email
    }
    return {success: true, data: data}
  } catch (error) {
    return {success: false, error: error}
  }
}

export const register = async (
  name: string,
  email: string,
  countryCode: string,
  phone: string,
  password: string
) => {
  try {
    
    // First, create the user with email and password
    // createUserWithEmailAndPassword(auth, email, password).then(res => {
    //   console.log(res);
    // }).catch(err => {
    //   console.error(err.message);
    // })
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('---------------', userCredential);

    // Optionally, you can update the user's profile with additional information (like name and phone number)
    // await user.updateProfile({
    //   displayName: name, // Set the display name
    // });

    // Store phone number if needed, in Firebase Firestore (optional)
    // You can store this in Firebase Firestore or Realtime Database, depending on your app
    // For Firestore example:
    // const firestore = require('@react-native-firebase/firestore');
    // await firestore().collection('users').doc(user.uid).set({
    //   name,
    //   phone,
    //   countryCode,
    // });

    // Optionally, you can send an email verification
    await setDoc(doc(firestore, "users", user.uid), {
      name,
      email,
      countryCode,
      phone,
      createdAt: new Date().toISOString(),
    });

    await sendEmailVerification(user);
    return { success: true, data: user };
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, message: error};
  }
}

// export const sendVerificationCode = (
//   email: string
// ) => {
//   return axiosInstance.post(
//     '/auth/send-verification-code',
//     {
//       email
//     },
//   )
//     .then(response => {
//       if (response.data.code === 0) {
//         return { success: true, data: response.data.data };
//       } else {
//         return { success: false, message: response.data.error };
//       }
//     })
//     .catch(error => {
//       console.error(error);
//       return { success: false, message: error.message };
//     });
// }

export const sendVerificationCode = async (
  email: string
) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error("Error sending reset email", error);
    alert(error.message);
  }
}


export const verifyCode = (
  email: string
) => {
  return axiosInstance.post(
    '/auth/verify-code',
    {
      email
    },
  )
    .then(response => {
      if (response.data.code === 0) {
        return { success: true, data: response.data.data };
      } else {
        return { success: false, message: response.data.error };
      }
    })
    .catch(error => {
      console.error(error);
      return { success: false, message: error.message };
    });
}

export const resetPassword = (
  password: string,
  token: string
) => {
  return axiosInstance.post(
    '/auth/reset-password',
    {
      password,
      token
    },
  )
    .then(response => {
      if (response.data.code === 0) {
        return { success: true, data: response.data.data };
      } else {
        return { success: false, message: response.data.error };
      }
    })
    .catch(error => {
      console.error(error);
      return { success: false, message: error.message };
    });
}

export const updatePassword = (
  currentPassword: string,
  newPassword: string
) => {
  return axiosInstance.post(
    '/auth/reset-password',
    {
      currentPassword,
      newPassword
    },
  )
    .then(response => {
      if (response.data.code === 0) {
        return { success: true, data: response.data.data };
      } else {
        return { success: false, message: response.data.error };
      }
    })
    .catch(error => {
      console.error(error);
      return { success: false, message: error.message };
    });
}

