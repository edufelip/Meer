import type { ContentComment } from "../entities/ContentComment";
import type { ContentCommentRepository } from "../repositories/ContentCommentRepository";
import { validateCommentBody } from "../validation/comments";

export class CreateContentCommentUseCase {
  constructor(private readonly repository: ContentCommentRepository) {}

  async execute(params: { contentId: string; body: string }): Promise<ContentComment> {
    const validation = validateCommentBody(params.body);
    if (!validation.valid) {
      throw new Error(validation.error ?? "Comentário inválido.");
    }
    return this.repository.create(params.contentId, validation.normalized);
  }
}
