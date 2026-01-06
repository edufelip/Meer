import { api } from "../../../api/client";
import type { ContentComment } from "../../../domain/entities/ContentComment";
import type { ContentCommentListParams, ContentCommentPage } from "../../../domain/repositories/ContentCommentRepository";
import type { ContentCommentRemoteDataSource } from "../ContentCommentRemoteDataSource";

export class HttpContentCommentRemoteDataSource implements ContentCommentRemoteDataSource {
  async list(params: ContentCommentListParams): Promise<ContentCommentPage> {
    const res = await api.get<ContentCommentPage>(`/contents/${params.contentId}/comments`, {
      params: {
        page: params.page ?? 0,
        pageSize: params.pageSize ?? 20
      }
    });
    return {
      items: res.data.items ?? [],
      page: res.data.page ?? params.page ?? 0,
      hasNext: res.data.hasNext ?? false
    };
  }

  async create(contentId: string, body: string): Promise<ContentComment> {
    const res = await api.post<ContentComment>(`/contents/${contentId}/comments`, { body });
    return res.data;
  }

  async update(contentId: string, commentId: string, body: string): Promise<ContentComment> {
    const res = await api.patch<ContentComment>(`/contents/${contentId}/comments/${commentId}`, { body });
    return res.data;
  }

  async delete(contentId: string, commentId: string): Promise<void> {
    await api.delete(`/contents/${contentId}/comments/${commentId}`);
  }
}
