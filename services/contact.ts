/**
 * Contact Service
 * RTHA
 * 
 * Created By Thornton at 02/08/2025
 */
import axiosInstance from './instance';

export const getContactList = () => {
  return axiosInstance.get(
    '/contact/list'
  )
    .then(response => {
      return { success: true, data: response.data };
    })
    .catch(error => {
      console.log(error);
      return { success: false, message: error.message };
    });
}