/**
 * Appointment Service
 * RTHA
 * 
 * Created by Thornton on 02/06/2025
 */
import dayjs from 'dayjs';
import axiosInstance from './instance';

import { addData, deleteData, getAllData, Tables, updateData } from './db';
import { IAppointment } from '@/@types';
import { SyncStatus } from '@/config/constants';

export const appointmentSyncWithServer = async (): Promise<boolean> => {
  return axiosInstance.get(
    '/appointment/list'
  )
    .then(response => {
      if (response.data.code === 0) {
        for (let i = 0; i < response.data.data.length; i++) {
          const d = response.data.data[i];
          addData(Tables.APPOINTMENTS, { ...d, syncStatus: SyncStatus.SYNCED });
        }
        return true;
      } else {
        return false;
      }
    })
    .catch(error => {
      console.error(error);
      return false;
    });
}

export const appointmentSyncToServer = async (appointmentData: IAppointment[]): Promise<boolean> => {
  return axiosInstance.put(
    '/appointment/update',
    appointmentData,
  )
    .then(response => {
      if (response.data.code === 0) {
        return true;
      } else {
        return false;
      }
    })
    .catch(error => {
      console.error(error);
      return false;
    });
}

export const getAppointmentList = async () => {
  try {
    const appointmentList = await getAllData(Tables.APPOINTMENTS);
    const list = appointmentList.map((v: any) => ({
      id: v.id,
      name: v.name,
      phone: v.phone,
      image: v.image,
      scheduledTime: v.scheduled_time,
      description: v.description,
      location: v.location,
    }));
    return { success: true, data: list };
  } catch (error) {
    console.error(error);
    return { success: true, message: error instanceof Error ? error.message : 'unknown error' };
  }
  
}

export const getTodayAppointmentList = async () => {
  const todayStr = dayjs().format('YYYY-MM-DD');
  try {
    const appointmentList = await getAllData(Tables.APPOINTMENTS);
    let list: IAppointment[] = appointmentList.map((v: any) => ({
      id: v.id,
      name: v.name,
      phone: v.phone,
      image: v.image,
      scheduledTime: v.scheduled_time,
      description: v.description,
      location: v.location,
    }));
    list = list.filter(v => dayjs(v.scheduledTime, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD') === todayStr);
    return { success: true, data: list };
  } catch (error) {
    console.error(error);
    return { success: false, message: error instanceof Error ? error.message : 'unknown error' };
  }
}

export const deleteAppointment = (appointmentId: number): boolean => {
  try {
    let ret = deleteData(Tables.APPOINTMENTS, appointmentId);    
    return ret;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export const updateAppointment = (appointment: IAppointment): boolean => {  
  try {
    if (appointment.id) {
      let ret = updateData(Tables.APPOINTMENTS, appointment.id, { ...appointment, syncStatus: SyncStatus.UPDATED });
      return ret;
    } else {
      return false;
    }   
  } catch (error) {
    console.error(error);
    return false;
  }
}

export const addAppointment = (appointment: IAppointment): boolean => {
  try {
    let ret = addData(Tables.APPOINTMENTS, { ...appointment, syncStatus: SyncStatus.ADDED });
    return ret >= 0;
  } catch (error) {
    console.error(error);
    return false;
  }
}
