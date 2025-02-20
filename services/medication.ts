/**
 * Medication Service
 * RTHA
 * 
 * Created by Thornton on 01/23/2025
 */
import axiosInstance from './instance';

import { IMedication } from '@/@types';
import { MedicationCycleType } from '@/config/constants';
import { addData, deleteData, getAllData, Tables, updateData } from '@/services/db';
import dayjs from 'dayjs';

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

const getCombinedMedicationList = async (): Promise<IMedication[]> => {
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
      threshold: v1.threshold,
      emailAlert: v1.email_alert,
      pushAlert: v1.push_alert,
      frequency: {
        dosage: f.dosage,
        dosageUnit: f.dosage_unit,
        cycle: f.cycle,
        times: f.times.split(',')
      }
    }
  });
  return resultList;
}

export const getMedicationList = async () => {
  try {
    const resultList: IMedication[] = await getCombinedMedicationList();
  
    return { success: true, data: resultList };
  } catch (error) {
    console.log(error);
    return { success: false, message: error instanceof Error ? error.message : 'unknown error' };
  }
}

export const deleteMedication = (medicationId: number): boolean => {
  try {
    let ret = deleteData(Tables.MEDICATIONS, medicationId);
    if (ret) {
      ret = deleteData(Tables.FREQUENCIES, medicationId, 'medication_id');
    }
    return ret;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const updateMedication = (medication: IMedication): boolean => {  
  try {
    if (medication.id) {
      const { frequency, ...rest } = medication;
      let ret = updateData(Tables.MEDICATIONS, medication.id, rest);
      if (ret) {
        ret = updateData(Tables.FREQUENCIES, medication.id, frequency, 'medication_id');
        return ret;
      }   
      return false;
    } else {
      return false;
    }   
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const addMedication = (medication: IMedication): boolean => {
  try {
    const { frequency, ...rest } = medication;
    let ret = addData(Tables.MEDICATIONS, rest);
    if (ret >= 0) {
      ret = addData(Tables.FREQUENCIES, { medicationId: ret, ...frequency });
      return ret >= 0;
    }
    return false;    
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const getTodayMedicationList = async () => {
  const todayStr = dayjs().format('YYYY-MM-DD');
  try {
    const resultList: IMedication[] = await getCombinedMedicationList();
    const list: IMedication[] = [];
    for (let i = 0; i < resultList.length; i++) {
      const medication = resultList[i];
      if (medication.frequency.cycle === MedicationCycleType.EVERYDAY) {
        list.push(medication);
      } else if (medication.frequency.cycle === MedicationCycleType.TWODAYS) {
        const startDate = medication.startDate;
        if (startDate === todayStr) {
          list.push(medication);
        } else {
          const dateStr = dayjs(startDate, 'YYYY-MM-DD').add(2, 'day').format('YYYY-MM-DD');
          if (dateStr === todayStr) {
            list.push(medication)
          }
        }

      } else if (medication.frequency.cycle === MedicationCycleType.THREEDAYS) {
        const startDate = medication.startDate;
        if (startDate === todayStr) {
          list.push(medication);
        } else {
          const dateStr = dayjs(startDate, 'YYYY-MM-DD').add(3, 'day').format('YYYY-MM-DD');
          if (dateStr === todayStr) {
            list.push(medication)
          }
        }
      }
    }
    return { success: true, data: list };
  } catch (error) {
    console.log(error);
    return { success: false, message: error instanceof Error ? error.message : 'unknown error' };
  }
}

export const getRefillMedicationList = async () => {
  try {
    const resultList: IMedication[] = await getCombinedMedicationList();
    const list: IMedication[] = resultList.filter(v => v.stock < v.threshold);
    return { success: true, data: list };
  } catch (error) {
    console.log(error);
    return { success: false, message: error instanceof Error ? error.message : 'unknown error' };
  }
}

export const getMedicationSufficient = async () => {
  try {
    const resultList: IMedication[] = await getCombinedMedicationList();  
    const sum = resultList.reduce((acc: number, cur: IMedication) => acc + (cur.stock >= cur.threshold ? 100 : cur.stock / cur.threshold * 100), 0);
    const sufficient = Math.floor(sum / resultList.length);
    return { success: true, data: { sufficient } };
  } catch (error) {
    console.log(error);
    return { success: true, data: { sufficient: 0 } };
  }
}