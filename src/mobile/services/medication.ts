/**
 * Medication Service
 * RTHA
 * 
 * Created by Morgan on 01/23/2025
 */
import axiosInstance from './instance';
import dayjs from 'dayjs';

import { IFrequency, IMedication } from '@/@types';
import { MedicationCycleType, SyncStatus } from '@/config/constants';
import { addData, deleteData, getAllData, Tables, updateData } from '@/services/db';
import { useId } from 'react';

export const frequencySyncWithServer = async (userId?: string): Promise<boolean> => {
  return axiosInstance.get(
    `/medication/frequency/${userId}`
  )
    .then(response => {
      if (response.data.code === 0) {
        for (let i = 0; i < response.data.data.length; i++) {
          const d = response.data.data[i];
          const data = {
            id: d.id,
            userId: d.user_id,
            medicationId: d.medication_id,
            dosage: d.dosage,
            dosageUnit: d.dosage_unit,
            cycle: d.cycle,
            times: d.times
          }
          addData(Tables.FREQUENCIES, { ...data, syncStatus: SyncStatus.SYNCED });
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

export const frequencySyncToServer = async (frequencyData: IFrequency): Promise<boolean> => {
  const data = {
    id: frequencyData.id,
    medication_id: frequencyData.medicationId,
    user_id: frequencyData.userId,
    dosage: frequencyData.dosage,
    dosage_unit: frequencyData.dosageUnit,
    times: frequencyData.times,
    cycle: frequencyData.cycle
  }
  return axiosInstance.put(
    '/medication/frequency/update',
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



export const frequencyListSyncToServer = async (frequencyData: IFrequency[], userId?: string): Promise<boolean> => {

  return axiosInstance.put(
    '/medication/frequency/update/list',
    {frequencyData, userId}
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


export const addFrequencySyncToServer = async (frequencyData: IFrequency): Promise<boolean> => {
  const data = {
    id: frequencyData.id,
    medication_id: frequencyData.medicationId,
    user_id: frequencyData.userId,
    dosage: frequencyData.dosage,
    dosage_unit: frequencyData.dosageUnit,
    times: frequencyData.times,
    cycle: frequencyData.cycle
  }
  return axiosInstance.put(
    '/medication/frequency/add',
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
export const deleteFrequencySyncToServer = async (frequencyId: number, userId?: string): Promise<boolean> => {
  return axiosInstance.delete(
    `/medication/frequency/${userId}/${frequencyId}`
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
export const medicationSyncWithServer = async (userId?: string): Promise<boolean> => {
  return axiosInstance.get(
    `/medication/${userId}`
  )
    .then(response => {
      if (response.data.code === 0) {
        for (let i = 0; i < response.data.data.length; i++) {         
          const d = response.data.data[i];
          const data = {
            id: d.id,
            userId: d.user_id,
            name: d.name,
            image: d.image,
            stock: d.stock,
            threshold: d.threshold,
            emailAlert: d.email_alert,
            startDate: d.start_date,
            endDate: d.end_date,
            stockDate: d.stock_date,
            pushAlert: d.push_alert
          }
          addData(Tables.MEDICATIONS, { ...data, syncStatus: SyncStatus.SYNCED });
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

export const addMedicationSyncToServer = async (medicationData: IMedication): Promise<boolean> => {
  const data = {
    id: medicationData.id,
    user_id: medicationData.userId,
    name: medicationData.name,
    image: medicationData.image,
    stock: medicationData.stock,
    start_date: medicationData.startDate,
    end_date: medicationData.endDate,
    stock_date: medicationData.stockDate,
    threshold: medicationData.threshold,
    push_alert: medicationData.pushAlert,
    email_alert: medicationData.emailAlert
  }
  return axiosInstance.put(
    '/medication/add',
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
      return false;
    });
}
export const medicationSyncToServer = async (medicationData: IMedication): Promise<boolean> => {
  const data = {
    id: medicationData.id,
    user_id: medicationData.userId,
    name: medicationData.name,
    image: medicationData.image,
    stock: medicationData.stock,
    start_date: medicationData.startDate,
    end_date: medicationData.endDate,
    stock_date: medicationData.stockDate,
    threshold: medicationData.threshold,
    push_alert: medicationData.pushAlert,
    email_alert: medicationData.emailAlert
  }

  return axiosInstance.put(
    '/medication/update',
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
export const medicationListSyncToServer = async (medicationData: IMedication[], userId?: string): Promise<boolean> => {
  return axiosInstance.put(
    '/medication/update/list',{
      medicationData, userId
    }
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
export const deleteMedicationSyncToServer = async (medicationId: number, userId?: string): Promise<boolean> => {
  return axiosInstance.delete(
    `/medication/${userId}/${medicationId}`
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

export const getCombinedMedicationList = async (userId: string): Promise<IMedication[]> => {
  const medicationList = await getAllData(Tables.MEDICATIONS, userId);
  const frequencyList = await getAllData(Tables.FREQUENCIES, userId);
  const resultList: IMedication[] = medicationList.map((v1: any) => {
    const f = frequencyList.find((v2: any) => v2.medication_id === v1.id);

    return {
      id: v1.id,
      userId: v1.user_id,
      name: v1.name,
      stock: v1.stock,
      miniStock: v1.mini_stock,
      startDate: v1.start_date,
      endDate: v1.end_date,
      stockDate: v1.stock_date,
      threshold: v1.threshold,
      emailAlert: v1.email_alert,
      pushAlert: v1.push_alert,
      frequency: f ? {
        id: f.id,
        userId: f.user_id,
        medicationId: f.medication_id,
        dosage: f.dosage,
        dosageUnit: f.dosage_unit,
        cycle: f.cycle,
        times: f.times.split(',')
      } : null
    }
  });
  return resultList;
}

export const getMedicationList = async (userId: string) => {
  try {
    const resultList: IMedication[] = await getCombinedMedicationList(userId);
    return { success: true, data: resultList };
  } catch (error) {
    console.log(error);
    return { success: false, message: error instanceof Error ? error.message : 'unknown error' };
  }
}

export const deleteMedication = async(medicationId: number, userId?: string): Promise<boolean> => {
  try {
    let ret = deleteData(Tables.MEDICATIONS, medicationId);

    if (ret) {
      let bret = await deleteMedicationSyncToServer(medicationId, userId);
      ret = deleteData(Tables.FREQUENCIES, medicationId, 'medication_id');
      if(ret) {
        await deleteFrequencySyncToServer(medicationId, userId);
      }
    }
    return ret;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const updateMedication = async(medication: IMedication): Promise<boolean> => { 
  try {
    if (medication.id) {
      const { frequency, ...rest } = medication;
      let medicationId = updateData(Tables.MEDICATIONS, medication.id, { ...rest, syncStatus: SyncStatus.UPDATED });
      if (medicationId) {
        let bret = await medicationSyncToServer(medication);
        if(bret){
          updateData(
            Tables.MEDICATIONS,
            medication.id,
            { ...rest, syncStatus: SyncStatus.SYNCED }
          );
        }
        let frequencyId = updateData(Tables.FREQUENCIES, medication.id, { ...frequency, syncStatus: SyncStatus.UPDATED }, 'medication_id');
        if(frequencyId){
          bret = await frequencySyncToServer(frequency);
          if(bret){
            updateData(
              Tables.FREQUENCIES,
              medication.id,
              { ...frequency, syncStatus: SyncStatus.SYNCED }
            );
          }
        }
        return frequencyId;
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

export const addMedication = async (medication: IMedication): Promise<boolean> => {  
  try {
    const { frequency, ...rest } = medication;
    let medicationId = addData(Tables.MEDICATIONS, { ...rest, syncStatus: SyncStatus.ADDED });
    if (medicationId >= 0) {
      let frequencyId = addData(Tables.FREQUENCIES, {...frequency, medicationId: medicationId, syncStatus: SyncStatus.ADDED });

      if (frequencyId >= 0) {
        medication = {
          ...medication,
          id: medicationId
        };
        let bret = await addMedicationSyncToServer(medication);
        if (bret) {
          updateData(
            Tables.MEDICATIONS,
            medicationId,
            { ...rest, syncStatus: SyncStatus.SYNCED }
          );
          medication.frequency = {
            ...medication.frequency,
            id: frequencyId,
            medicationId: medicationId
          }
          bret = await addFrequencySyncToServer(medication.frequency);
          updateData(
            Tables.FREQUENCIES,
            frequencyId,
            { ...frequency, syncStatus: SyncStatus.SYNCED }
          );
        }
      }
      
      return frequencyId >= 0;
    }
    return false;    
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const getTodayMedicationList = async (userId: string) => {
  const todayStr = dayjs().format('YYYY-MM-DD');
  try {
    const resultList: IMedication[] = await getCombinedMedicationList(userId);
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

export const getRefillMedicationList = async (userId: string) => {
  try {
    const resultList: IMedication[] = await getCombinedMedicationList(userId);
    const list: IMedication[] = resultList.filter(v => v.stock < v.threshold);
    return { success: true, data: list };
  } catch (error) {
    console.log(error);
    return { success: false, message: error instanceof Error ? error.message : 'unknown error' };
  }
}

export const getMedicationSufficient = async (userId: string) => {
  try {
    const resultList: IMedication[] = await getCombinedMedicationList(userId);  
    if (resultList.length > 0) {
      const sum = resultList.reduce((acc: number, cur: IMedication) => acc + (cur.stock >= cur.threshold ? 100 : cur.stock / cur.threshold * 100), 0);
      const sufficient = Math.floor(sum / resultList.length);
      return { success: true, data: { sufficient } };
    } else {
      return { success: true, data: { sufficient: 0 } };
    }
  } catch (error) {
    console.log(error);
    return { success: true, data: { sufficient: 0 } };
  }
}