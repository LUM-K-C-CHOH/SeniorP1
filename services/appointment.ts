/**
 * Appointment Service
 * RTHA
 * 
 * Created by Thornton on 02/06/2025
 */
import axiosInstance from './instance';

export const getAppointmentList = () => {
  return axiosInstance.get(
    '/appointment/list'
  )
    .then(response => {
      return { success: true, data: response.data };
    })
    .catch(error => {
      console.log(error);
      return { success: false, message: error.message };
    });
}