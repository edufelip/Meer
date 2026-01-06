import type { ContentComment } from "../../domain/entities/ContentComment";
import type { ContentCommentListParams, ContentCommentPage } from "../../domain/repositories/ContentCommentRepository";

export interface ContentCommentRemoteDataSource {
  list(params: ContentCommentListParams): Promise<ContentCommentPage>;
  create(contentId: string, body: string): Promise<ContentComment>;
  update(contentId: string, commentId: string, body: string): Promise<ContentComment>;
  delete(contentId: string, commentId: string): Promise<void>;
}
