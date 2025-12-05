import type { GuideContentRepository } from "../repositories/GuideContentRepository";

export class UpdateContentUseCase {
  constructor(private readonly repo: GuideContentRepository) {}

  execute(id: string, payload: { title?: string; description?: string; imageUrl?: string }) {
    return this.repo.updateContent(id, payload);
  }
}
