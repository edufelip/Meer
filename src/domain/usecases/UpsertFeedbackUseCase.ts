import type { Feedback } from "../entities/Feedback";
import type { FeedbackRepository } from "../repositories/FeedbackRepository";

export class UpsertFeedbackUseCase {
  constructor(private readonly repo: FeedbackRepository) {}
  execute(feedback: Feedback): Promise<void> {
    return this.repo.upsert(feedback);
  }
}
