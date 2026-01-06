import type { ContentCommentRepository, ContentCommentListParams, ContentCommentPage } from "../../domain/repositories/ContentCommentRepository";
import type { ContentComment } from "../../domain/entities/ContentComment";
import type { ContentCommentRemoteDataSource } from "../datasources/ContentCommentRemoteDataSource";

export class ContentCommentRepositoryImpl implements ContentCommentRepository {
  constructor(private readonly remote: ContentCommentRemoteDataSource) {}

  list(params: ContentCommentListParams): Promise<ContentCommentPage> {
    return this.remote.list(params);
  }

  create(contentId: string, body: string): Promise<ContentComment> {
    return this.remote.create(contentId, body);
  }

  update(contentId: string, commentId: string, body: string): Promise<ContentComment> {
    return this.remote.update(contentId, commentId, body);
  }

  delete(contentId: string, commentId: string): Promise<void> {
    return this.remote.delete(contentId, commentId);
  }
}
