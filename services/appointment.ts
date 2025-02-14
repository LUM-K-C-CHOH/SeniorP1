/**
 * Appointment Service
 * RTHA
 * 
 * Created by Thornton on 02/06/2025
 */
import dayjs from 'dayjs';
import axiosInstance from './instance';

export const getAppointmentList = () => {
  return axiosInstance.get(
    '/appointment/list'
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

export const getTodayAppointmentList = () => {
  const todayStr = dayjs().format('YYYY-MM-DD');
  return axiosInstance.get(
    `/appointment/list?date=${todayStr}`
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
