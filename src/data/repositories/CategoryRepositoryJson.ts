import type { Category } from "../../domain/entities/Category";
import type { CategoryRepository } from "../../domain/repositories/CategoryRepository";
import type { CategoryRemoteDataSource } from "../datasources/CategoryRemoteDataSource";
import type { CategoryLocalDataSource } from "../datasources/CategoryLocalDataSource";

export class CategoryRepositoryJson implements CategoryRepository {
  private readonly remote: CategoryRemoteDataSource;
  private readonly local: CategoryLocalDataSource;

  constructor(remote: CategoryRemoteDataSource, local: CategoryLocalDataSource) {
    this.remote = remote;
    this.local = local;
  }

  async list(): Promise<Category[]> {
    const categories = await this.remote.list();
    await this.local.saveCategories(categories);
    return categories;
  }

  getCached(): Promise<Category[] | null> {
    return this.local.getCategories();
  }

  saveCache(categories: Category[]): Promise<void> {
    return this.local.saveCategories(categories);
  }
}
