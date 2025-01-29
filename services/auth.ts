import axiosInstance from './instance';

export const login = (email: string, password: string) => {
  return axiosInstance.post(
    '/auth/login',
    {
      email,
      password
    },
  )
    .then(response => {
      return { success: true, data: response.data };
    })
    .catch(error => {
      console.log(error);
      return { success: false, message: error.message };
    });
}