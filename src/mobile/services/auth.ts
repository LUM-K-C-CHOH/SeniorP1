/**
 * Auth Service
 * RTHA
 * 
 * Created by Morgan on 01/23/2025
 */
import axiosInstance from './instance';
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updatePassword as firebaseUpdatePassword } from 'firebase/auth';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { auth, firestore} from '@/config/firebaseConfig';
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
    console.log('Error registering user:', error);
    return { success: false, message: error};
  }
}

export const sendVerificationCode = async (
  email: string
) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error: any) {
    console.log("Error sending reset email", error);
    return false;
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
      console.log(error);
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
      console.log(error);
      return { success: false, message: error.message };
    });
}

export const updatePassword = async (
  email: string,
  currentPassword: string,
  newPassword: string
): Promise<{code: number}> => {
    // const user = auth.currentUser;

    // if (!user || !user.email) {
    //   throw new Error("No user is currently logged in.");
    // }

    // Create a credential with the user's current email and password
    // const credential = EmailAuthProvider.credential(email, currentPassword);
    // Re-authenticate the user
  
    // await reauthenticateWithCredential(credential.user, credential);
    
    // Update the password
      return new Promise((resolve) => {
        signInWithEmailAndPassword(auth, email, currentPassword)
          .then(userCredential => {
            const user = userCredential.user;
  
            if (!user) {
              return resolve({ code: -1 });
            }
  
            firebaseUpdatePassword(user, newPassword)
              .then(res => {
                console.log("Password updated successfully!", res);
                return resolve({ code: 0 });
              })
              .catch(error => {
                console.log("Error update password: ", error);
                return resolve({ code: -2 });
              })
          })
          .catch(error => {
            console.log("Error login: ", error);
            return resolve({ code: -1 });
          });
      });
    
}

