import type { GuideContent } from "../entities/GuideContent";
import type { GuideContentRepository } from "../repositories/GuideContentRepository";

export class GetGuideContentUseCase {
  private readonly repository: GuideContentRepository;

  constructor(repository: GuideContentRepository) {
    this.repository = repository;
  }

  execute(params?: { page?: number; pageSize?: number; storeId?: string }): Promise<{
    items: GuideContent[];
    page: number;
    hasNext: boolean;
  }> {
    return this.repository.listLatest(params);
  }
}
