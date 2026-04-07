import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import firebaseCompat from 'firebase/compat/app';
import axios, { AxiosInstance } from 'axios';

import { ENV } from '../config/env';

// Initialize Firebase with environment config
const app = initializeApp(ENV.FIREBASE);
export const auth = getAuth(app);

// Initialize compat layer for expo-firebase-recaptcha
if (!firebaseCompat.apps.length) {
  firebaseCompat.initializeApp(ENV.FIREBASE);
}

const apiClient: AxiosInstance = axios.create({
  baseURL: ENV.API.BASE_URL,
  timeout: ENV.API.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default app;
