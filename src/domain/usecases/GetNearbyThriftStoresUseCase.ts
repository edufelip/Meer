import type { ThriftStore } from "../entities/ThriftStore";
import type { ThriftStoreRepository } from "../repositories/ThriftStoreRepository";

export class GetNearbyThriftStoresUseCase {
  private readonly repository: ThriftStoreRepository;

  constructor(repository: ThriftStoreRepository) {
    this.repository = repository;
  }

  async execute(params?: { lat?: number; lng?: number; page?: number; pageSize?: number }): Promise<ThriftStore[]> {
    const res = await this.repository.getNearby(params);
    return res.items ?? [];
  }
}
