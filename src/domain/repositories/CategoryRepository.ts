import type { Category } from "../entities/Category";

export interface CategoryRepository {
  list(): Promise<Category[]>;
  getCached(): Promise<Category[] | null>;
  saveCache(categories: Category[]): Promise<void>;
}
