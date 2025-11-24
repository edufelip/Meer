import type { ProfileRepository } from "../repositories/ProfileRepository";
import type { User } from "../entities/User";

export class GetProfileUseCase {
  private readonly repository: ProfileRepository;

  constructor(repository: ProfileRepository) {
    this.repository = repository;
  }

  execute(): Promise<
    User & { bio?: string; notifyNewStores: boolean; notifyPromos: boolean; ownedThriftStore?: any }
  > {
    return this.repository.getProfile();
  }
}
