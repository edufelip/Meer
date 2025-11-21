import type { User } from "../../domain/entities/User";
import type { ProfileRepository } from "../../domain/repositories/ProfileRepository";
import type { ProfileRemoteDataSource } from "../datasources/ProfileRemoteDataSource";

type ProfilePayload = User & { bio?: string; notifyNewStores: boolean; notifyPromos: boolean };

export class ProfileRepositoryJson implements ProfileRepository {
  private readonly remote: ProfileRemoteDataSource;

  constructor(remote: ProfileRemoteDataSource) {
    this.remote = remote;
  }

  getProfile(): Promise<ProfilePayload> {
    return this.remote.getProfile();
  }

  updateProfile(payload: Partial<ProfilePayload>): Promise<ProfilePayload> {
    return this.remote.updateProfile(payload);
  }
}
