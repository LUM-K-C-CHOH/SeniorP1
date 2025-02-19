/**
 * Setting Service
 * RTHA
 * 
 * Created by Thornton on 02/18/2025
 */
import axiosInstance from './instance';

import { addData, Tables } from './db';

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