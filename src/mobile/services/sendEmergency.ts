import axiosInstance from './instance';

export const sendEmergencySyncToServer = async (emergencyData: String[], currentAddress: String[]): Promise<object> => {
  try {
    const response = await axiosInstance.post('/sendEmergency', {emergencyData, currentAddress});
    return {code: response.data.code, message: response.data.message};
  } catch (error) {
    return {code: 2, message: "failed"};
  }
}