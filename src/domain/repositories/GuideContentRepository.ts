import type { GuideContent } from "../entities/GuideContent";

export interface GuideContentRepository {
  listLatest(): Promise<GuideContent[]>;
}
