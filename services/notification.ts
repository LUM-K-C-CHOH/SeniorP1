/**
 * Notification Service
 * RTHA
 * 
 * Created by Thornton on 02/10/2025
 */
import axiosInstance from './instance';

import { addData, getAllData, Tables } from './db';

export const notificationSync = async (): Promise<boolean> => {
  return axiosInstance.get(
    '/notification/list'
  )
    .then(response => {
      if (response.data.code === 0) {
        for (let i = 0; i < response.data.data.length; i++) {
          const d = response.data.data[i];
          addData(Tables.NOTIFICATIONS, d);
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

export const getNotificationList = async () => {
  try {
    const notificationList = await getAllData(Tables.NOTIFICATIONS);
    return { success: true, data: notificationList };
  } catch (error) {
    console.log(error);
    return { success: false, message: error instanceof Error ? error.message : 'unknown error' };
  }
}