/**
 * Medication Service
 * RTHA
 * 
 * Created by Thornton on 01/23/2025
 */
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