import { api } from "../../../api/client";
import type { ContentLikeRemoteDataSource } from "../ContentLikeRemoteDataSource";

export class HttpContentLikeRemoteDataSource implements ContentLikeRemoteDataSource {
  async like(contentId: string): Promise<void> {
    await api.post(`/contents/${contentId}/likes`);
  }

  async unlike(contentId: string): Promise<void> {
    await api.delete(`/contents/${contentId}/likes`);
  }
}
