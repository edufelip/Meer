import type { GuideContent } from "../entities/GuideContent";
import type { GuideContentRepository } from "../repositories/GuideContentRepository";

export class GetGuideContentUseCase {
  private readonly repository: GuideContentRepository;

  constructor(repository: GuideContentRepository) {
    this.repository = repository;
  }

  execute(): Promise<GuideContent[]> {
    return this.repository.listLatest();
  }
}
