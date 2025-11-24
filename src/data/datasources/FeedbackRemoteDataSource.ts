import type { Feedback } from "../../domain/entities/Feedback";

export interface FeedbackRemoteDataSource {
  getMine(storeId: string): Promise<Feedback | null>;
  upsert(feedback: Feedback): Promise<void>;
  delete(storeId: string): Promise<void>;
}
