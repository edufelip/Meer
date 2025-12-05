import type { GuideContentRepository } from "../repositories/GuideContentRepository";

export class RequestContentImageUploadUseCase {
  constructor(private readonly repo: GuideContentRepository) {}

  execute(contentId: string, contentType?: string) {
    return this.repo.requestImageUpload(contentId, contentType);
  }
}
