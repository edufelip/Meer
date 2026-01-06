import type { ContentComment } from "../entities/ContentComment";

export type ContentCommentListParams = {
  contentId: string;
  page?: number;
  pageSize?: number;
};

export type ContentCommentPage = {
  items: ContentComment[];
  page: number;
  hasNext: boolean;
};

export interface ContentCommentRepository {
  list(params: ContentCommentListParams): Promise<ContentCommentPage>;
  create(contentId: string, body: string): Promise<ContentComment>;
  update(contentId: string, commentId: string, body: string): Promise<ContentComment>;
  delete(contentId: string, commentId: string): Promise<void>;
}
