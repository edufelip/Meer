import type { Category } from "../../domain/entities/Category";

export interface CategoryLocalDataSource {
  getCategories(): Promise<Category[] | null>;
  saveCategories(categories: Category[]): Promise<void>;
  clear(): Promise<void>;
}
