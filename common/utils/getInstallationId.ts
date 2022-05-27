import AsyncStorage from '@react-native-async-storage/async-storage';
import { nanoid } from 'nanoid/non-secure';

export const getInstallationId = async () => {
  try {
    let value = await AsyncStorage.getItem('installation-id');
    if (!value) {
      value = nanoid();
      await AsyncStorage.setItem('installation-id', value);
    }
    return value;
  } catch (error: any) {}
  return null;
};
