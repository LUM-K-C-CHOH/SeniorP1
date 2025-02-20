/**
 * Emergency Service
 * RTHA
 * 
 * Created by Thornton on 02/10/2025
 */
import axiosInstance from './instance';

import { addData, deleteDataGroup, getAllData, Tables } from './db';

export const emergencyContactSync = async (): Promise<boolean> => {
  return axiosInstance.get(
    '/emergency/contact/list'
  )
    .then(response => {
      if (response.data.code === 0) {
        for (let i = 0; i < response.data.data.length; i++) {
          const d = response.data.data[i];
          addData(Tables.EMERGENCY_CONTACTS, d);
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

export const getEmergencyContactList = async () => {
  try {
    const contactList = await getAllData(Tables.EMERGENCY_CONTACTS);
    return { success: true, data: contactList };
  } catch (error) {
    console.log(error);
    return { success: false, message: error instanceof Error ? error.message : 'unknown error' };
  }
}

export const deleteEmergencyContactGroup = (idList: string): boolean => {
  try {
    const ret = deleteDataGroup(Tables.EMERGENCY_CONTACTS, idList);
    return ret;
  } catch (error) {
    console.log(error);
    return false;
  }
}