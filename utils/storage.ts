/**
 * Local Storage Manage
 * RTHA
 * 
 * Created By Thornton at 01/23/2025
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

export const setStorageItem = async (key: string, data: string): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(key, data);
    return true;
  } catch (e) {
    return false;
  }
}

export const getStorageItem = async (key: string): Promise<string> => {
  const value = await AsyncStorage.getItem(key);
  return value?? '';
}