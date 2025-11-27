import type { Category } from "../entities/Category";
import type { CategoryRepository } from "../repositories/CategoryRepository";

export class GetCachedCategoriesUseCase {
  private readonly repository: CategoryRepository;

  constructor(repository: CategoryRepository) {
    this.repository = repository;
  }

  execute(): Promise<Category[] | null> {
    return this.repository.getCached();
  }
}
