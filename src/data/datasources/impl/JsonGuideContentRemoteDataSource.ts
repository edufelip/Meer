import type { GuideContent } from "../../../domain/entities/GuideContent";
import type { GuideContentRemoteDataSource } from "../GuideContentRemoteDataSource";
import homeData from "../../mocks/thriftStores.json";
import { loadFromJson } from "./LocalJsonClient";

type HomeResponse = { articles?: GuideContent[] };

export class JsonGuideContentRemoteDataSource implements GuideContentRemoteDataSource {
  async listLatest(): Promise<GuideContent[]> {
    const { articles = [] } = homeData as HomeResponse;
    return loadFromJson<GuideContent[]>(articles);
  }
}
