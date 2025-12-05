import type { GuideContentRepository } from "../repositories/GuideContentRepository";

export class DeleteContentUseCase {
  constructor(private readonly repo: GuideContentRepository) {}

  execute(id: string) {
    return this.repo.deleteContent(id);
  }
}
