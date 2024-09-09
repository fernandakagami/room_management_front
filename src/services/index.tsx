import axios from "axios";

export const instance = axios.create({
  baseURL: `http://127.0.0.1:8000/api`
});


export const useApi = () => {
  const defaultOptions = {
    baseURL: `http://127.0.0.1:8000/api`,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let instance = axios.create(defaultOptions);

  return instance;
};