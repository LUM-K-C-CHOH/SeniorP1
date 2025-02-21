/**
 * Setting Service
 * RTHA
 * 
 * Created by Thornton on 02/18/2025
 */
import axiosInstance from './instance';

import { addData, getRowData, Tables, updateData } from './db';
import { ISetting } from '@/@types';
import { SyncStatus } from '@/config/constants';

export const userSettingSync = async (): Promise<boolean> => {
  return axiosInstance.post(
    '/user/setting'
  )
    .then(response => {
      if (response.data.code === 0) {
        addData(Tables.SETTINGS, { ...response.data.data, syncStatus: SyncStatus.SYNCED });
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

export const getUserSetting = (userId: number): ISetting => {
  const setting: any = getRowData(Tables.SETTINGS, userId, 'user_id');
  const data: ISetting = {
    push: setting.push,
    font: setting.font,
    theme: setting.theme
  }
  return data as ISetting;
}

export const updateUserSetting = (setting: ISetting, userId?: number): boolean => {
  if (!userId) return false;

  const ret = updateData(Tables.SETTINGS, userId, { ...setting, syncStatus: SyncStatus.UPDATED }, 'user_id');
  return ret;
}

export const addUserSetting = (setting: ISetting): boolean => {
  const ret = addData(Tables.SETTINGS, { ...setting, syncStatus: SyncStatus.ADDED });
  return ret >= 0;
}