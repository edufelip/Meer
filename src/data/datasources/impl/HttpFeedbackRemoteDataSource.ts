import { api } from "../../../api/client";
import type { Feedback } from "../../../domain/entities/Feedback";
import type { FeedbackRemoteDataSource } from "../FeedbackRemoteDataSource";

export class HttpFeedbackRemoteDataSource implements FeedbackRemoteDataSource {
  async getMine(storeId: string): Promise<Feedback | null> {
    try {
      const res = await api.get<Feedback>(`/stores/${storeId}/feedback`);
      return res.data;
    } catch (e: any) {
      if (e?.response?.status === 404) return null;
      throw e;
    }
  }

  async upsert(feedback: Feedback): Promise<void> {
    await api.post(`/stores/${feedback.storeId}/feedback`, {
      score: feedback.score,
      body: feedback.body
    });
  }

  async delete(storeId: string): Promise<void> {
    await api.delete(`/stores/${storeId}/feedback`);
  }
}
