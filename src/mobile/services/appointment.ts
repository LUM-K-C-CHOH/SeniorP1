/**
 * Appointment Service
 * RTHA
 * 
 * Created by Morgan on 02/06/2025
 */
import dayjs from 'dayjs';
import axiosInstance from './instance';

import { addData, deleteData, getAllData, Tables, updateData } from './db';
import { IAppointment } from '@/@types';
import { SyncStatus } from '@/config/constants';

export const appointmentSyncWithServer = async (userId?: string): Promise<boolean> => {
  return axiosInstance.get(
    `/appointment/${userId}`
  )
    .then(response => {
      if (response.data.code === 0) {
        for (let i = 0; i < response.data.data.length; i++) {
          const d = response.data.data[i];
          const data = {
            id: d.id,
            userId: d.user_id,
            name: d.name,
            phone: d.phone,
            image: d.image,
            scheduledTime: d.scheduled_time,
            location: d.location,
            description: d.description
          }
          addData(Tables.APPOINTMENTS, { ...data, syncStatus: SyncStatus.SYNCED });
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

export const appointmentSyncToServer = async (appointmentData: IAppointment): Promise<boolean> => {
  const data = {
    id: appointmentData.id,
    user_id: appointmentData.userId,
    name: appointmentData.name,
    phone: appointmentData.phone,
    image: appointmentData.image,
    scheduled_time: appointmentData.scheduledTime,
    description: appointmentData.description,
    location: appointmentData.location
  }
  return axiosInstance.put(
    '/appointment',
    data,
  )
    .then(response => {
      if (response.data.code === 0) {
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



export const appointmentListSyncToServer = async (appointmentData: IAppointment[], userId: string): Promise<boolean> => {

  return axiosInstance.put(
    '/appointment/list',
    {appointmentData, userId}
  )
    .then(response => {
      if (response.data.code === 0) {
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


export const deleteAppointmentSyncToServer = async (appointmentId: number, userId?: string): Promise<boolean> => {
  return axiosInstance.delete(
    `/appointment/${userId}/${appointmentId}`
  )
    .then(response => {
      console.log(response)
      if (response.data.code === 0) {
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
export const addAppointmentSyncToServer = async (appointmentData: IAppointment): Promise<boolean> => {
  const data = {
    id: appointmentData.id,
    user_id: appointmentData.userId,
    name: appointmentData.name,
    phone: appointmentData.phone,
    image: appointmentData.image,
    scheduled_time: appointmentData.scheduledTime,
    description: appointmentData.description,
    location: appointmentData.location
  }

  return axiosInstance.post(
    '/appointment',
    data,
  )
    .then(response => {
      if (response.data.code === 0) {
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
export const getAppointmentList = async (userId: string) => {
  try {
    const appointmentList = await getAllData(Tables.APPOINTMENTS, userId);
    const list = appointmentList.map((v: any) => ({
      id: v.id,
      userId: v.user_id,
      name: v.name,
      phone: v.phone,
      image: v.image,
      scheduledTime: v.scheduled_time,
      description: v.description,
      location: v.location,
    }));
    return { success: true, data: list };
  } catch (error) {
    console.log(error);
    return { success: true, message: error instanceof Error ? error.message : 'unknown error' };
  }
  
}

export const getTodayAppointmentList = async (userId: string) => {
  const todayStr = dayjs().format('YYYY-MM-DD');
  try {
    const appointmentList = await getAllData(Tables.APPOINTMENTS, userId);
    let list: IAppointment[] = appointmentList.map((v: any) => ({
      id: v.id,
      name: v.name,
      phone: v.phone,
      image: v.image,
      scheduledTime: v.scheduled_time,
      description: v.description,
      location: v.location,
    }));
    list = list.filter(v => dayjs(v.scheduledTime, 'YYYY-MM-DDTHH:mm:ss:Z').format('YYYY-MM-DD') === todayStr);
    return { success: true, data: list };
  } catch (error) {
    console.log(error);
    return { success: false, message: error instanceof Error ? error.message : 'unknown error' };
  }
}

export const deleteAppointment = async (appointmentId: number, userId?: string): Promise<boolean> => {
  try {
    let ret = deleteData(Tables.APPOINTMENTS, appointmentId);    
    if(ret){
      await deleteAppointmentSyncToServer(appointmentId, userId)
    }
    return ret;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const updateAppointment = async (appointment: IAppointment): Promise<boolean> => {  
  try {
    if (appointment.id) {
      let ret = updateData(Tables.APPOINTMENTS, appointment.id, { ...appointment, syncStatus: SyncStatus.UPDATED });
      if(ret){
        let bret = await appointmentSyncToServer(appointment);
        if(bret){
          updateData(Tables.APPOINTMENTS, appointment.id, { ...appointment, syncStatus: SyncStatus.SYNCED });
          return true;
        }
        return true;
      }
      return false;
    } else {
      return false;
    }   
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const addAppointment = async (appointment: IAppointment): Promise<boolean> => {
  try {
    let appointmentId = addData(Tables.APPOINTMENTS, { ...appointment, syncStatus: SyncStatus.ADDED });
    if(appointmentId){
      appointment = {
        ...appointment,
        id: appointmentId
      }
      let bret = await addAppointmentSyncToServer(appointment);
      if(bret){
        updateData(Tables.APPOINTMENTS, appointmentId, { ...appointment, syncStatus: SyncStatus.SYNCED });
      }
    }
    return appointmentId >= 0;
  } catch (error) {
    console.log(error);
    return false;
  }
}
