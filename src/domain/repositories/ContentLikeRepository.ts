export interface ContentLikeRepository {
  like(contentId: string): Promise<void>;
  unlike(contentId: string): Promise<void>;
}
