/**
 * Emergency Service
 * RTHA
 * 
 * Created by Thornton on 02/10/2025
 */
import axiosInstance from './instance';

import { addData, deleteDataGroup, getAllData, Tables, updateData } from './db';
import { IEmergencyContact } from '@/@types';
import { SyncStatus } from '@/config/constants';

export const emergencyContactSyncWithServer = async (userId?: string): Promise<boolean> => {
  return axiosInstance.get(
    `/emergency/contact/${userId}`
  )
    .then(response => {
      if (response.data.code === 0) {
        for (let i = 0; i < response.data.data.length; i++) {
          const d = response.data.data[i];
          const data = {
            id: d.id,
            name: d.name,
            phone: d.phone,
            image: d.image,
            type: d.type
          }
          addData(Tables.EMERGENCY_CONTACTS, { ...data, syncStatus: SyncStatus.SYNCED });
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

export const emergencyContactSyncToServer = async (emergencyContactData: IEmergencyContact, userId?: string): Promise<boolean> => {
  const data = {
    ...emergencyContactData,
    user_id: userId
  }
  return axiosInstance.put(
    '/emergency/contact/update',
    data
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
export const deleteEmergencyContactSyncToServer = async (contactList: string, userId?: string): Promise<boolean> => {
  
  return axiosInstance.delete(
    `/emergency/contact/${userId}`,{
      data: {contactList},
      headers: { "Content-Type": "application/json" }
    }

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
export const getEmergencyContactList = async () => {
  try {
    const contactList = await getAllData(Tables.EMERGENCY_CONTACTS);
    const list: IEmergencyContact[] = contactList.map((v: any) => ({
      id: v.id,
      name: v.name,
      phone: v.phone,
      image: v.image,
      type: v.type
    }));
    return { success: true, data: list };
  } catch (error) {
    console.error(error);
    return { success: false, message: error instanceof Error ? error.message : 'unknown error' };
  }
}

export const deleteEmergencyContactGroup = async (idList: string, userId ?: string): Promise<boolean> => {
  try {
    const ret = deleteDataGroup(Tables.EMERGENCY_CONTACTS, idList);
    if(ret){
      await deleteEmergencyContactSyncToServer(idList, userId)
      return true;
    }
    return ret;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export const addEmergencyContact = async (contact: IEmergencyContact, userId?: string): Promise<boolean> => {
  try {
    let emergencyId = addData(Tables.EMERGENCY_CONTACTS, { ...contact, syncStatus: SyncStatus.ADDED });
    if(emergencyId){
      contact = {
        ...contact,
        id: emergencyId
      }
      let bret = await emergencyContactSyncToServer(contact, userId);
      if(bret){
        updateData(Tables.EMERGENCY_CONTACTS, emergencyId, { ...contact, syncStatus: SyncStatus.SYNCED });
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}