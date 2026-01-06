import type { ContentCommentRepository } from "../repositories/ContentCommentRepository";

export class DeleteContentCommentUseCase {
  constructor(private readonly repository: ContentCommentRepository) {}

  execute(params: { contentId: string; commentId: string }): Promise<void> {
    return this.repository.delete(params.contentId, params.commentId);
  }
}
