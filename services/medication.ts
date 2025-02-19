/**
 * Medication Service
 * RTHA
 * 
 * Created by Thornton on 01/23/2025
 */
import axiosInstance from './instance';

import { IMedication } from '@/@types';
import { addData, getAllData, Tables } from '@/services/db';

export const frequencySync = async (): Promise<boolean> => {
  return axiosInstance.get(
    '/medication/frequency/list'
  )
    .then(response => {
      if (response.data.code === 0) {
        for (let i = 0; i < response.data.data.length; i++) {
          const d = response.data.data[i];
          addData(Tables.FREQUENCIES, d);
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

export const medicationSync = async (): Promise<boolean> => {
  return axiosInstance.get(
    '/medication/list'
  )
    .then(response => {
      console.log(response)
      if (response.data.code === 0) {
        for (let i = 0; i < response.data.data.length; i++) {
          const d = response.data.data[i];
          addData(Tables.MEDICATIONS, d);
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

export const getMedicationList = async () => {
  try {
    const medicationList = await getAllData(Tables.MEDICATIONS);
    const frequencyList = await getAllData(Tables.FREQUENCIES);
    const resultList: IMedication[] = medicationList.map((v1: any) => {
      const f = frequencyList.find((v2: any) => v2.medication_id === v1.id);
      return {
        id: v1.id,
        name: v1.name,
        stock: v1.stock,
        miniStock: v1.mini_stock,
        startDate: v1.start_date,
        endDate: v1.end_date,
        frequency: {
          dosage: f.dosage,
          dosageUnit: f.dosage_unit,
          cycle: f.cycle,
          times: f.times.split(',')
        }
      }
    });
  
    return { success: true, data: resultList };
  } catch (error: any) {
    console.log(error);
    return { success: true, message: error.message };
  }
}

export const getTodayMedicationList = async () => {
  try {
    const medicationList = await getAllData(Tables.MEDICATIONS);
    const frequencyList = await getAllData(Tables.FREQUENCIES);
  
    const resultList: IMedication[] = medicationList.map((v1: any) => {
      const f = frequencyList.find((v2: any) => v2.medication_id === v1.id);
      return {
        id: v1.id,
        name: v1.name,
        stock: v1.stock,
        miniStock: v1.mini_stock,
        startDate: v1.start_date,
        endDate: v1.end_date,
        frequency: {
          dosage: f.dosage,
          dosageUnit: f.dosage_unit,
          cycle: f.cycle,
          times: f.times.split(',')
        }
      }
    });
  
    return { success: true, data: resultList };
  } catch (error: any) {
    console.log(error);
    return { success: true, message: error.message };
  }
}

export const getRefillMedicationList = async () => {
  try {
    const medicationList = await getAllData(Tables.MEDICATIONS);
    const frequencyList = await getAllData(Tables.FREQUENCIES);
  
    const resultList: IMedication[] = medicationList.map((v1: any) => {
      const f = frequencyList.find((v2: any) => v2.medication_id === v1.id);
      return {
        id: v1.id,
        name: v1.name,
        stock: v1.stock,
        miniStock: v1.mini_stock,
        startDate: v1.start_date,
        endDate: v1.end_date,
        frequency: {
          dosage: f.dosage,
          dosageUnit: f.dosage_unit,
          cycle: f.cycle,
          times: f.times.split(',')
        }
      }
    });
  
    return { success: true, data: resultList };
  } catch (error: any) {
    console.log(error);
    return { success: true, message: error.message };
  }
}

export const getMedicationSufficient = async () => {
  try {
    const medicationList = await getAllData(Tables.MEDICATIONS);
    const frequencyList = await getAllData(Tables.FREQUENCIES);
  
    const resultList: IMedication[] = medicationList.map((v1: any) => {
      const f = frequencyList.find((v2: any) => v2.medication_id === v1.id);
      return {
        id: v1.id,
        name: v1.name,
        stock: v1.stock,
        miniStock: v1.mini_stock,
        startDate: v1.start_date,
        endDate: v1.end_date,
        frequency: {
          dosage: f.dosage,
          dosageUnit: f.dosage_unit,
          cycle: f.cycle,
          times: f.times.split(',')
        }
      }
    });
  
    const sum = resultList.reduce((acc: number, cur: IMedication) => acc + (cur.stock >= cur.miniStock ? 100 : cur.stock / cur.miniStock * 100), 0);
    
    return { success: true, data: { sufficient: sum / resultList.length } };
  } catch (error: any) {
    console.log(error);
    return { success: true, data: { sufficient: 80 } };
  }
}