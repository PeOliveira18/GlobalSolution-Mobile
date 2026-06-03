import axios from 'axios';

export const openWeatherApi = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

openWeatherApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);
