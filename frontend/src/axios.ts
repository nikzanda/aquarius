import axios, { type AxiosInstance } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(error);

    const { data: { errors = [] } = {} } = error.response;
    if (errors?.length) {
      errors.forEach(({ msg, param }: any) => window.$message.error(`${param}: ${msg}`));
    } else {
      window.$message.error('errore');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
