import type { GuideContent } from "../../../domain/entities/GuideContent";
import type { GuideContentRemoteDataSource } from "../GuideContentRemoteDataSource";
import { api } from "../../../api/client";

export class HttpGuideContentRemoteDataSource implements GuideContentRemoteDataSource {
  async listLatest(params?: { page?: number; pageSize?: number; storeId?: string }): Promise<{
    items: GuideContent[];
    page: number;
    hasNext: boolean;
  }> {
    const res = await api.get<{
      items: GuideContent[];
      page: number;
      hasNext: boolean;
    }>("/contents/top", {
      params: {
        page: params?.page ?? 0,
        pageSize: params?.pageSize ?? 10,
        storeId: params?.storeId
      }
    });
    return res.data;
  }

  async createContent(payload: { title: string; description?: string; storeId: string }): Promise<{ id: string }> {
    const res = await api.post<{ id: string }>("/contents", payload);
    return res.data;
  }

  async updateContent(id: string, payload: { title?: string; description?: string; imageUrl?: string }): Promise<void> {
    await api.put(`/contents/${id}`, payload);
  }

  async requestImageUpload(
    contentId: string,
    contentType?: string
  ): Promise<{ uploadUrl: string; fileKey: string; contentType: string }> {
    const res = await api.post(`/contents/${contentId}/image/upload`, contentType ? { contentType } : {});
    return res.data;
  }

  async deleteContent(id: string): Promise<void> {
    await api.delete(`/contents/${id}`);
  }
}
