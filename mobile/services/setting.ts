/**
 * Setting Service
 * RTHA
 * 
 * Created by Thornton on 02/18/2025
 */
import axiosInstance from './instance';

import { addData, getAllData, Tables, updateAllData } from './db';
import { ISetting } from '@/@types';
import { InitialAppState, SyncStatus } from '@/config/constants';

export const userSettingSyncWithServer = async (): Promise<boolean> => {
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
      console.error(error);
      return false;
    });
}

export const userSettingSyncToServer = async (settingData: ISetting): Promise<boolean> => {
  return axiosInstance.post(
    '/user/setting/update',
    settingData
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

export const getUserSetting = async (): Promise<ISetting> => {
  try {
    const settingList: any = await getAllData(Tables.SETTINGS);
    
    const data: ISetting = {
      push: settingList[0].push,
      font: settingList[0].font,
      theme: settingList[0].theme
    }
    return data as ISetting;
  } catch (error) {
    console.error(error);
    return InitialAppState.setting;
  }
}

export const updateUserSetting = (setting: ISetting): boolean => {
  const ret = updateAllData(Tables.SETTINGS, { ...setting, syncStatus: SyncStatus.UPDATED });
  return ret;
}

export const addUserSetting = (setting: ISetting): boolean => {
  const ret = addData(Tables.SETTINGS, { ...setting, syncStatus: SyncStatus.ADDED });
  return ret >= 0;
}