/**
 * Contact Service
 * RTHA
 * 
 * Created by Morgan on 02/08/2025
 */
import axiosInstance from './instance';

export const getContactList = () => {
  return axiosInstance.get(
    '/contact/list'
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