import type { GuideContent } from "../entities/GuideContent";

export interface GuideContentRepository {
  listLatest(limit?: number): Promise<GuideContent[]>;
}
