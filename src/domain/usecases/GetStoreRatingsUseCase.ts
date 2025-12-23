import type { FeedbackRepository } from "../repositories/FeedbackRepository";
import type { StoreRating } from "../entities/StoreRating";

export class GetStoreRatingsUseCase {
  constructor(private readonly repo: FeedbackRepository) {}

  execute(params: {
    storeId: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ items: StoreRating[]; page: number; hasNext: boolean }> {
    return this.repo.listStoreRatings(params);
  }
}
