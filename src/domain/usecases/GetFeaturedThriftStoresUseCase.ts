import type { ThriftStore } from "../entities/ThriftStore";
import type { ThriftStoreRepository } from "../repositories/ThriftStoreRepository";

export class GetFeaturedThriftStoresUseCase {
  private readonly repository: ThriftStoreRepository;

  constructor(repository: ThriftStoreRepository) {
    this.repository = repository;
  }

  execute(params?: { lat?: number; lng?: number }): Promise<ThriftStore[]> {
    return this.repository.getFeatured(params);
  }
}
