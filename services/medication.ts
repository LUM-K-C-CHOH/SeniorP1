/**
 * Medication Service
 * RTHA
 * 
 * Created by Thornton on 01/23/2025
 */
import { IMedication } from '@/@types';
import axiosInstance from './instance';

export const getMedicationList = () => {
  return axiosInstance.get(
    '/medication/list'
  )
    .then(response => {
      if (response.data.code === 0) {
        return { success: true, data: response.data.data };
      } else {
        return { success: false, message: response.data.error };
      }
    })
    .catch(error => {
      console.log(error);
      return { success: false, message: error.message };
    });
}

export const getTodayMedicationList = () => {
  return axiosInstance.get(
    '/medication/list'
  )
    .then(response => {
      if (response.data.code === 0) {
        return { success: true, data: response.data.data };
      } else {
        return { success: false, message: response.data.error };
      }
    })
    .catch(error => {
      console.log(error);
      return { success: false, message: error.message };
    });
}

export const getRefillMedicationList = () => {
  return axiosInstance.get(
    '/medication/list'
  )
    .then(response => {
      if (response.data.code === 0) {

        return { success: true, data: response.data.data };
      } else {
        return { success: false, message: response.data.error };
      }
    })
    .catch(error => {
      console.log(error);
      return { success: false, message: error.message };
    });
}

export const getMedicationSufficient = () => {
  return axiosInstance.get(
    '/medication/list'
  )
    .then(response => {
      if (response.data.code === 0) {
        const sum = response.data.data.reduce((acc: number, cur: IMedication) => acc + (cur.stock >= cur.miniStock ? 100 : cur.stock / cur.miniStock * 100), 0);
        return { success: true, data: { sufficient: sum / response.data.data.length } };
      } else {
        return { success: false, message: response.data.error };
      }
    })
    .catch(error => {
      console.log(error);
      return { success: false, message: error.message };
    });
}