/**
 * Auth Service
 * RTHA
 * 
 * Created By Thornton at 01/23/2025
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
      return { success: true, data: response.data };
    })
    .catch(error => {
      console.log(error);
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
      return { success: true, data: response.data };
    })
    .catch(error => {
      console.log(error);
      return { success: false, message: error.message };
    });
}