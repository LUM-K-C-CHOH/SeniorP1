/**
 * Notification Service
 * RTHA
 * 
 * Created by Thornton on 02/10/2025
 */
import axiosInstance from './instance';

import { addData, deleteDataGroup, getAllData, Tables, updateData } from './db';
import { SyncStatus } from '@/config/constants';
import { INotification } from '@/@types';

export const notificationSyncWithServer = async (userId?: string): Promise<boolean> => {
  return axiosInstance.get(
    `/notification/${userId}`
  )
    .then(response => {
      if (response.data.code === 0) {
        for (let i = 0; i < response.data.data.length; i++) {
          const d = response.data.data[i];
          addData(Tables.NOTIFICATIONS, { ...d, syncStatus: SyncStatus.SYNCED });
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

export const notificationSyncToServer = async (notificationData: INotification, userId?: string): Promise<boolean> => {

  return axiosInstance.put(
    '/notification/update',
    notificationData
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

export const getNotificationList = async () => {
  try {
    const notificationList = await getAllData(Tables.NOTIFICATIONS);
    const list: INotification[] = notificationList.map((v: any) => ({
      id: v.id,
      type: v.type,
      var1: v.var1,
      var2: v.var2,
      var3: v.var3,
      status: v.status,
      targetId: v.target_id
    }));
    return { success: true, data: list };
  } catch (error) {
    console.error(error);
    return { success: false, message: error instanceof Error ? error.message : 'unknown error' };
  }
}

export const addNotification = async (notification: INotification, userId?: string): Promise<boolean> => {
  try {
    let ret = addData(Tables.NOTIFICATIONS, { ...notification, syncStatus: SyncStatus.ADDED });
    if(ret){
      let bret = await notificationSyncToServer(notification, userId);
      if(bret){
        updateData(Tables.NOTIFICATIONS, ret, { ...notification, syncStatus: SyncStatus.SYNCED });
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export const deleteNotificationGroup = (idList: string): boolean => {
  try {
    const ret = deleteDataGroup(Tables.NOTIFICATIONS, idList);
    return ret;
  } catch (error) {
    console.error(error);
    return false;
  }
}