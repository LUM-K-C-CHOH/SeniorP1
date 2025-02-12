/**
 * Notification Service
 * RTHA
 * 
 * Created By Thornton at 02/10/2025
 */
import axiosInstance from './instance';

export const getNotificationList = () => {
  return axiosInstance.get(
    '/notification/list'
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