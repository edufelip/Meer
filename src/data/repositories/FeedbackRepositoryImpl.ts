import type { FeedbackRepository } from "../../domain/repositories/FeedbackRepository";
import type { Feedback } from "../../domain/entities/Feedback";
import type { StoreRating } from "../../domain/entities/StoreRating";
import type { FeedbackRemoteDataSource } from "../datasources/FeedbackRemoteDataSource";

export class FeedbackRepositoryImpl implements FeedbackRepository {
  constructor(private readonly remote: FeedbackRemoteDataSource) {}

  getMine(storeId: string): Promise<Feedback | null> {
    return this.remote.getMine(storeId);
  }

  upsert(feedback: Feedback): Promise<void> {
    return this.remote.upsert(feedback);
  }

  delete(storeId: string): Promise<void> {
    return this.remote.delete(storeId);
  }

  listStoreRatings(params: {
    storeId: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ items: StoreRating[]; page: number; hasNext: boolean }> {
    return this.remote.listStoreRatings(params);
  }
}
