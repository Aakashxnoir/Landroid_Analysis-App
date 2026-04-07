import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';
let Keychain: any;
if (!isWeb) {
  Keychain = require('react-native-keychain');
}

const TOKEN_KEY = 'landroid_firebase_token';
const REFRESH_TOKEN_KEY = 'landroid_refresh_token';

class SecureStoreService {
  /**
   * Store the Firebase ID token securely
   * @param token Firebase ID Token
   */
  static async saveToken(token: string): Promise<boolean> {
    if (isWeb) {
      try {
        localStorage.setItem(TOKEN_KEY, token);
        return true;
      } catch (e) {
        return false;
      }
    }
    
    try {
      await Keychain.setGenericPassword(TOKEN_KEY, token, {
        service: TOKEN_KEY,
        accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Retrieve the stored Firebase ID token
   */
  static async getToken(): Promise<string | null> {
    if (isWeb) {
      try {
        return localStorage.getItem(TOKEN_KEY);
      } catch (e) {
        return null;
      }
    }

    try {
      const credentials = await Keychain.getGenericPassword({ service: TOKEN_KEY });
      if (credentials) {
        return credentials.password;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Clear all stored credentials
   */
  static async removeToken(): Promise<boolean> {
    if (isWeb) {
      try {
        localStorage.removeItem(TOKEN_KEY);
        return true;
      } catch (e) {
        return false;
      }
    }

    try {
      await Keychain.resetGenericPassword({ service: TOKEN_KEY });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Store any generic sensitive data
   */
  static async saveGeneric(key: string, value: string): Promise<boolean> {
    if (isWeb) {
      try {
        localStorage.setItem(key, value);
        return true;
      } catch (e) {
        return false;
      }
    }

    try {
      await Keychain.setGenericPassword(key, value, { service: key });
      return true;
    } catch (error) {
      return false;
    }
  }

  static async getGeneric(key: string): Promise<string | null> {
    if (isWeb) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        return null;
      }
    }

    try {
      const credentials = await Keychain.getGenericPassword({ service: key });
      if (credentials) return credentials.password;
      return null;
    } catch (error) {
      return null;
    }
  }
}

export default SecureStoreService;
