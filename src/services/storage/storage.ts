import AsyncStorage from '@react-native-async-storage/async-storage';

export class StorageService {
  private static async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      throw new Error(`Failed to save ${key} to storage`);
    }
  }

  private static async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      throw new Error(`Failed to retrieve ${key} from storage`);
    }
  }

  private static async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      throw new Error(`Failed to remove ${key} from storage`);
    }
  }

  static async saveObject<T>(key: string, value: T): Promise<void> {
    const jsonValue = JSON.stringify(value);
    await this.setItem(key, jsonValue);
  }

  static async getObject<T>(key: string): Promise<T | null> {
    const jsonValue = await this.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  }

  static async saveString(key: string, value: string): Promise<void> {
    await this.setItem(key, value);
  }

  static async getString(key: string): Promise<string | null> {
    return await this.getItem(key);
  }

  static async remove(key: string): Promise<void> {
    await this.removeItem(key);
  }

  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      throw new Error('Failed to clear storage');
    }
  }
}

export const StorageKeys = {
  CART: 'cart',
  USER: 'user',
  AUTH_TOKEN: 'auth_token',
  SELECTED_ADDRESS: 'selected_address',
  LOCATION_ENABLED: 'location_enabled',
} as const;

