/**
 * Auth Service
 * RTHA
 * 
 * Created by Thornton on 01/23/2025
 */
import axiosInstance from './instance';

export const login = (email: string, password: string) => {
  return axiosInstance.post(
    '/auth/login',
    {
      email,
      password
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

export const register = (
  name: string,
  email: string,
  countryCode: string,
  phone: string,
  password: string
) => {
  return axiosInstance.post(
    '/auth/register',
    {
      name,
      email,
      password,
      countryCode,
      phone
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

export const sendVerificationCode = (
  email: string
) => {
  return axiosInstance.post(
    '/auth/send-verification-code',
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

