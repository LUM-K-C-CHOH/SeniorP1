/**
 * Setting Service
 * RTHA
 * 
 * Created by Morgan on 02/18/2025
 */
import axiosInstance from './instance';

import { addData, getAllData, Tables, updateAllData } from './db';
import { ISetting } from '@/@types';
import { InitialAppState, SyncStatus } from '@/config/constants';

export const userSettingSyncWithServer = async (userId?: string): Promise<boolean> => {
  return axiosInstance.get(
    `/user/setting/${userId}`
  )
  .then(response => {
    if (response.data.code === 0) {
      const data = {
        push: response.data.data[0] ? response.data.data[0].push : 'on',
        font: response.data.data[0] ? response.data.data[0].font : 'small',
        theme: response.data.data[0] ? response.data.data[0].theme : 'light',
      }
        addData(Tables.SETTINGS, { ...data, syncStatus: SyncStatus.SYNCED });
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

export const userSettingSyncToServer = async (settingData: ISetting, userId?: string): Promise<boolean> => {
  const data = {
    ...settingData,
    user_id: userId 
  }
  
  return axiosInstance.put(
    '/user/setting',
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

export const updateUserSetting = async (setting: ISetting, userId?: string): Promise<boolean> => {
  const ret = updateAllData(Tables.SETTINGS, { ...setting, syncStatus: SyncStatus.UPDATED });
  if(ret){
    let bret = await userSettingSyncToServer(setting, userId);
    if(bret){
      updateAllData(Tables.SETTINGS, { ...setting, syncStatus: SyncStatus.SYNCED });
      return true;
    }
    return false;
  }
  return ret;
}
