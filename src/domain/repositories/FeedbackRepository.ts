import type { Feedback } from "../entities/Feedback";

export interface FeedbackRepository {
  getMine(storeId: string): Promise<Feedback | null>;
  upsert(feedback: Feedback): Promise<void>;
  delete(storeId: string): Promise<void>;
}
