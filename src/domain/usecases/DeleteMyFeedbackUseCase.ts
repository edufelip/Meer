import type { FeedbackRepository } from "../repositories/FeedbackRepository";

export class DeleteMyFeedbackUseCase {
  constructor(private readonly repo: FeedbackRepository) {}
  execute(storeId: string): Promise<void> {
    return this.repo.delete(storeId);
  }
}
