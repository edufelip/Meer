import type { GuideContent } from "../../domain/entities/GuideContent";

export interface GuideContentRemoteDataSource {
  listLatest(limit?: number): Promise<GuideContent[]>;
}
