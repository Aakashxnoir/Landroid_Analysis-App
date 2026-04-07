/**
 * Environment Configuration
 * In a real production app, use expo-constants or react-native-dotenv
 */

export const ENV = {
  FIREBASE: {
    apiKey: "AIzaSyDsgusFlDHtp3ejLdjpBhlUsOQb2tTfuC0",
    authDomain: "landroid-vit-auth.firebaseapp.com",
    projectId: "landroid-vit-auth",
    storageBucket: "landroid-vit-auth.firebasestorage.app",
    messagingSenderId: "188751254544",
    appId: "1:188751254544:web:574ebe99dea1d0db2a6695",
    measurementId: ""
  },
  GOOGLE_AUTH: {
    ANDROID_CLIENT_ID: "347896385091-6mic3u1n8js6u1uh6d04de03avi39mri.apps.googleusercontent.com",
    IOS_CLIENT_ID: "IOS_CLIENT_ID",
    WEB_CLIENT_ID: "347896385091-6mic3u1n8js6u1uh6d04de03avi39mri.apps.googleusercontent.com",
  },
  API: {
    BASE_URL: 'https://api.yourbackend.com',
    TIMEOUT: 10000,
  }
};
