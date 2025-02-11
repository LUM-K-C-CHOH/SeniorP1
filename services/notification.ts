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
      return { success: true, data: response.data };
    })
    .catch(error => {
      console.log(error);
      return { success: false, message: error.message };
    });
}