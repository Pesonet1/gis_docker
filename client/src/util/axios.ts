import axios, { AxiosInstance } from 'axios';

import { secService } from '../main'; // eslint-disable-line

let repository: AxiosInstance;

const setAuthorizationHeader = async () => {
  await secService.getAccessToken().then(async (accessToken: string | null) => {
    if (accessToken) {
      repository.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      return;
    }

    await secService.renewToken();
  }).catch((err: string) => {
    throw new Error(`Error while trying to get accessToken ${err.toString()}`);
  });
};

export const createRepository = async () => {
  repository = axios.create({
    headers: {
      Pragma: 'no-cache',
    },
    baseURL: 'http://localhost:8085/api',
    withCredentials: true,
  });

  await setAuthorizationHeader();
};

export const getRepository = async () => {
  if (!repository) {
    throw new Error('Repository is not initialized');
  }

  await setAuthorizationHeader();
  return repository;
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
