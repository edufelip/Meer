import type { ContentComment } from "../entities/ContentComment";
import type { ContentCommentRepository } from "../repositories/ContentCommentRepository";
import { validateCommentBody } from "../validation/comments";

export class UpdateContentCommentUseCase {
  constructor(private readonly repository: ContentCommentRepository) {}

  async execute(params: { contentId: string; commentId: string; body: string }): Promise<ContentComment> {
    const validation = validateCommentBody(params.body);
    if (!validation.valid) {
      throw new Error(validation.error ?? "Comentário inválido.");
    }
    return this.repository.update(params.contentId, params.commentId, validation.normalized);
  }
}
