import type { ProfileRepository } from "../repositories/ProfileRepository";

export class DeleteAccountUseCase {
  constructor(private readonly repository: ProfileRepository) {}

  execute(email: string): Promise<void> {
    return this.repository.deleteAccount(email);
  }
}
