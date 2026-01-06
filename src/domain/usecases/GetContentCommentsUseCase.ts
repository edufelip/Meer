import type { ContentCommentPage, ContentCommentListParams, ContentCommentRepository } from "../repositories/ContentCommentRepository";

export class GetContentCommentsUseCase {
  constructor(private readonly repository: ContentCommentRepository) {}

  execute(params: ContentCommentListParams): Promise<ContentCommentPage> {
    return this.repository.list(params);
  }
}
