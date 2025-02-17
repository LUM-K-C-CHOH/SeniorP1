import axiosInstance from './instance';

export const getMedicationList = () => {
  return axiosInstance.get(
    '/medication/list'
  )
    .then(response => {
      return { success: true, data: response.data };
    })
    .catch(error => {
      console.log(error);
      return { success: false, message: error.message };
    });
}