import AsyncStorage from '@react-native-async-storage/async-storage';

export const appStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) return window.localStorage.getItem(key);
      return await AsyncStorage.getItem(key);
    } catch { return null; }
  },
  async setItem(key: string, value: string): Promise<void> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) window.localStorage.setItem(key, value);
      else await AsyncStorage.setItem(key, value);
    } catch {}
  },
  async removeItem(key: string): Promise<void> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) window.localStorage.removeItem(key);
      else await AsyncStorage.removeItem(key);
    } catch {}
  },
};
