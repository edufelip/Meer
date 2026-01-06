import type { ContentLikeRepository } from "../repositories/ContentLikeRepository";

export class LikeContentUseCase {
  constructor(private readonly repository: ContentLikeRepository) {}

  execute(contentId: string): Promise<void> {
    return this.repository.like(contentId);
  }
}
