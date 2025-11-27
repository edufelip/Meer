import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Category } from "../../../domain/entities/Category";
import type { CategoryLocalDataSource } from "../CategoryLocalDataSource";

const KEY = "CATEGORIES_CACHE";

export class AsyncStorageCategoryLocalDataSource implements CategoryLocalDataSource {
  async getCategories(): Promise<Category[] | null> {
    const stored = await AsyncStorage.getItem(KEY);
    if (!stored) return null;
    try {
      const parsed = JSON.parse(stored) as Category[];
      return parsed;
    } catch {
      return null;
    }
  }

  async saveCategories(categories: Category[]): Promise<void> {
    await AsyncStorage.setItem(KEY, JSON.stringify(categories));
  }

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(KEY);
  }
}
