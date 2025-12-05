import type { GuideContent } from "../entities/GuideContent";

export interface GuideContentRepository {
  listLatest(params?: { page?: number; pageSize?: number; storeId?: string }): Promise<{
    items: GuideContent[];
    page: number;
    hasNext: boolean;
  }>;
  createContent(payload: { title: string; description?: string; storeId: string }): Promise<{ id: string }>;
  updateContent(id: string, payload: { title?: string; description?: string; imageUrl?: string }): Promise<void>;
  requestImageUpload(
    contentId: string,
    contentType?: string
  ): Promise<{ uploadUrl: string; fileKey: string; contentType: string }>;
  deleteContent(id: string): Promise<void>;
}
