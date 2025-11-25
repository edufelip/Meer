import type { GuideContent } from "../../../domain/entities/GuideContent";
import type { GuideContentRemoteDataSource } from "../GuideContentRemoteDataSource";
import { api } from "../../../api/client";

export class HttpGuideContentRemoteDataSource implements GuideContentRemoteDataSource {
  async listLatest(limit = 10): Promise<GuideContent[]> {
    const res = await api.get<GuideContent[]>("/contents/top", { params: { limit } });
    return res.data;
  }
}
