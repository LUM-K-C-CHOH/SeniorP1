/**
 * Appointment Service
 * RTHA
 * 
 * Created by Thornton on 02/06/2025
 */
import dayjs from 'dayjs';
import axiosInstance from './instance';

import { addData, getAllData, Tables } from './db';

export const appointmentSync = async (): Promise<boolean> => {
  return axiosInstance.get(
    '/appointment/list'
  )
    .then(response => {
      if (response.data.code === 0) {
        for (let i = 0; i < response.data.data.length; i++) {
          const d = response.data.data[i];
          addData(Tables.APPOINTMENTS, d);
        }
        return true;
      } else {
        return false;
      }
    })
    .catch(error => {
      console.log(error);
      return false;
    });
}

export const getAppointmentList = async () => {
  try {
    const appointmentList = await getAllData(Tables.APPOINTMENTS);
    return { success: true, data: appointmentList };
  } catch (error) {
    console.log(error);
    return { success: true, message: error instanceof Error ? error.message : 'unknown error' };
  }
  
}

export const getTodayAppointmentList = async () => {
  const todayStr = dayjs().format('YYYY-MM-DD');
  try {
    const appointmentList = await getAllData(Tables.APPOINTMENTS);
    return { success: true, data: appointmentList };
  } catch (error) {
    console.log(error);
    return { success: false, message: error instanceof Error ? error.message : 'unknown error' };
  }
}
