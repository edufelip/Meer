import type { ThriftStore } from "../entities/ThriftStore";
import type { GuideContent } from "../entities/GuideContent";
import type { ThriftStoreRepository } from "../repositories/ThriftStoreRepository";

export class GetHomeUseCase {
  constructor(private readonly repository: ThriftStoreRepository) {}

  execute(params?: { lat?: number; lng?: number }): Promise<{ featured: ThriftStore[]; nearby: ThriftStore[]; content: GuideContent[] }> {
    return this.repository.getHome(params);
  }
}
