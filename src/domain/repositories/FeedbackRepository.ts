import type { Feedback } from "../entities/Feedback";
import type { StoreRating } from "../entities/StoreRating";

export interface FeedbackRepository {
  getMine(storeId: string): Promise<Feedback | null>;
  upsert(feedback: Feedback): Promise<void>;
  delete(storeId: string): Promise<void>;
  listStoreRatings(params: {
    storeId: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ items: StoreRating[]; page: number; hasNext: boolean }>;
}
