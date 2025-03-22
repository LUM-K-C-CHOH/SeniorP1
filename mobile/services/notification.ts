/**
 * Notification Service
 * RTHA
 * 
 * Created by Morgan on 02/10/2025
 */
import axiosInstance from './instance';

import { addData, deleteDataGroup, getAllData, Tables, updateData } from './db';
import { SyncStatus } from '@/config/constants';
import { INotification } from '@/@types';
import { useId } from 'react';

export const notificationSyncWithServer = async (userId?: string): Promise<boolean> => {
  return axiosInstance.get(
    `/notification/${userId}`
  )
    .then(response => {
      if (response.data.code === 0) {
        for (let i = 0; i < response.data.data.length; i++) {
          const d = response.data.data[i];
          const data = {
            id: d.id,
            type: d.type,
            status: d.status,
            targetId: d.target_id,
            var1: d.var1,
            var2: d.var2,
            var3: d.var3
          }
          addData(Tables.NOTIFICATIONS, { ...data, syncStatus: SyncStatus.SYNCED });
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

export const notificationSyncToServer = async (notificationData: INotification, userId?: string): Promise<boolean> => {
  const data = {
    id: notificationData.id,
    user_id: userId,
    type: notificationData.type,
    status: notificationData.status,
    target_id: notificationData.targetId,
    var1: notificationData.var1,
    var2: notificationData.var2,
    var3: notificationData.var3
  }
  return axiosInstance.put(
    '/notification/update',
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
      console.log(error);
      return false;
    });
}



export const notificationListSyncToServer = async (notificationData: INotification[], userId?: string): Promise<boolean> => {

  return axiosInstance.put(
    '/notification/update/list',
    {notificationData, userId}
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
    console.log(error);
    return { success: false, message: error instanceof Error ? error.message : 'unknown error' };
  }
}

export const addNotification = async (notification: INotification, userId?: string): Promise<boolean> => {
  try {
    let notificationId = addData(Tables.NOTIFICATIONS, { ...notification, syncStatus: SyncStatus.ADDED });
    if(notificationId){
      notification = {
        ...notification,
        id: notificationId
      }
      let bret = await notificationSyncToServer(notification, userId);
      if(bret){
        updateData(Tables.NOTIFICATIONS, notificationId, { ...notification, syncStatus: SyncStatus.SYNCED });
        return true;
      }
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const updateNotification = async (notification: INotification, userId?: string): Promise<boolean> => {
  try {
    let ret = updateData(Tables.NOTIFICATIONS, notification.id as number, { ...notification, syncStatus: SyncStatus.UPDATED });
    if(ret){
      let bret = await notificationSyncToServer(notification, userId);
      if(bret){
        updateData(Tables.NOTIFICATIONS, notification.id as number, { ...notification, syncStatus: SyncStatus.SYNCED });
        return true;
      }
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}


export const deleteNotificationGroup = (idList: string): boolean => {
  try {
    const ret = deleteDataGroup(Tables.NOTIFICATIONS, idList);
    return ret;
  } catch (error) {
    console.log(error);
    return false;
  }
}