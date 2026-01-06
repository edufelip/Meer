export interface ContentLikeRemoteDataSource {
  like(contentId: string): Promise<void>;
  unlike(contentId: string): Promise<void>;
}
