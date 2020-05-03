
import axios, { AxiosInstance } from 'axios';

let repository: AxiosInstance;

const createRepository = () => {
  repository = axios.create({
    headers: {
      Pragma: 'no-cache',
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
      Cache: 'no-cache',
    },
    baseURL: 'http://localhost:8085/api/',
  });

  // instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;
};

export const getRequest = (path: string) => {
  if (!repository) createRepository();
  return repository
    .get(path)
    .then((response) => response.data);
};

export const postRequest = (path: string, data: any) => { // eslint-disable-line
  if (!repository) createRepository();
  return repository.post(path, data);
};
