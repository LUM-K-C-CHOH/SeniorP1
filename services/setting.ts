/**
 * Setting Service
 * RTHA
 * 
 * Created by Thornton on 02/18/2025
 */
import axiosInstance from './instance';

import { addData, getRowData, Tables, updateData } from './db';
import { ISetting } from '@/@types';

export const userSettingSync = async (): Promise<boolean> => {
  return axiosInstance.post(
    '/user/setting'
  )
    .then(response => {
      if (response.data.code === 0) {
        addData(Tables.SETTINGS, response.data.data);
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
  const data = getRowData(Tables.SETTINGS, userId, 'user_id');
  return data as ISetting;
}

export const updateUserSetting = (setting: ISetting, userId?: number): boolean => {
  if (!userId) return false;

  const ret = updateData(Tables.SETTINGS, userId, setting);
  return ret;
}