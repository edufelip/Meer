import type { ContentLikeRepository } from "../../domain/repositories/ContentLikeRepository";
import type { ContentLikeRemoteDataSource } from "../datasources/ContentLikeRemoteDataSource";

export class ContentLikeRepositoryImpl implements ContentLikeRepository {
  constructor(private readonly remote: ContentLikeRemoteDataSource) {}

  like(contentId: string): Promise<void> {
    return this.remote.like(contentId);
  }

  unlike(contentId: string): Promise<void> {
    return this.remote.unlike(contentId);
  }
}
