import type { ContentLikeRepository } from "../repositories/ContentLikeRepository";

export class UnlikeContentUseCase {
  constructor(private readonly repository: ContentLikeRepository) {}

  execute(contentId: string): Promise<void> {
    return this.repository.unlike(contentId);
  }
}
