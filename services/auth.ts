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
import { doc, setDoc, getDoc } from "firebase/firestore";

export const login = async (
  email: string,
  password: string
) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userRef = doc(firestore, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const me = userSnap.data();
    const data = {
      id: user.uid,
      name: me?.name,
      email: user.email
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

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

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

export const sendVerificationCode = async (
  email: string
) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error("Error sending reset email", error);
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

