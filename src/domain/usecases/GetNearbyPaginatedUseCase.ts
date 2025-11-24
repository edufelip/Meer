import type { ThriftStore } from "../entities/ThriftStore";
import type { ThriftStoreRepository } from "../repositories/ThriftStoreRepository";

export class GetNearbyPaginatedUseCase {
  constructor(private readonly repository: ThriftStoreRepository) {}

  execute(params: { page?: number; pageSize?: number; lat?: number; lng?: number }): Promise<{ items: ThriftStore[]; page: number; hasNext: boolean }> {
    return this.repository.listNearbyPaginated(params);
  }
}
