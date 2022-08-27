import axios, { type AxiosInstance } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api', // TODO: sostituire con .env
});

export default apiClient;
