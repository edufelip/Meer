import { api } from "../../../api/client";
import type { Feedback } from "../../../domain/entities/Feedback";
import type { StoreRating } from "../../../domain/entities/StoreRating";
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

  async listStoreRatings(params: {
    storeId: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ items: StoreRating[]; page: number; hasNext: boolean }> {
    const res = await api.get<{ items: StoreRating[]; page: number; hasNext: boolean }>(
      `/stores/${params.storeId}/ratings`,
      {
        params: {
          page: params.page ?? 1,
          pageSize: params.pageSize ?? 10
        }
      }
    );
    return res.data;
  }
}
