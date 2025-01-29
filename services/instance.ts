import axios from 'axios';

const prefixUrl = `${process.env.API_URL ? process.env.API_URL : ''}/`;

const axiosInstance = axios.create({
  baseURL: prefixUrl,
  timeout: 10000,
});

export default axiosInstance;