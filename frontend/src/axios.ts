import axios, { type AxiosInstance } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api', // TODO: sostituire con .env
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(error);

    const { data: { errors = [] } = {} } = error.response;
    errors.forEach((message) => window.$message.error(message));

    return error;
  }
);

export default apiClient;
