import type { Feedback } from "../entities/Feedback";
import type { FeedbackRepository } from "../repositories/FeedbackRepository";

export class GetMyFeedbackUseCase {
  constructor(private readonly repo: FeedbackRepository) {}
  execute(storeId: string): Promise<Feedback | null> {
    return this.repo.getMine(storeId);
  }
}
