import axiosInstance from './instance';

export const getAppointmentList = () => {
  return axiosInstance.get(
    '/appointment/list'
  )
    .then(response => {
      return { success: true, data: response.data };
    })
    .catch(error => {
      console.log(error);
      return { success: false, message: error.message };
    });
}