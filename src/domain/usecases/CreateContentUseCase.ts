import type { GuideContentRepository } from "../repositories/GuideContentRepository";

export class CreateContentUseCase {
  constructor(private readonly repo: GuideContentRepository) {}

  execute(payload: { title: string; description?: string; storeId: string }) {
    return this.repo.createContent(payload);
  }
}
