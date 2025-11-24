import profileData from "../../mocks/profile.json";
import { loadFromJson, saveToJson } from "./LocalJsonClient";
import type { ProfileRemoteDataSource } from "../ProfileRemoteDataSource";
import type { User } from "../../../domain/entities/User";

type ProfilePayload = User & { bio?: string; notifyNewStores: boolean; notifyPromos: boolean };

export class JsonProfileRemoteDataSource implements ProfileRemoteDataSource {
  private cache: ProfilePayload = profileData as ProfilePayload;

  async getProfile(): Promise<ProfilePayload> {
    return loadFromJson<ProfilePayload>(this.cache);
  }

  async updateProfile(
    payload: Partial<User> & { bio?: string; notifyNewStores?: boolean; notifyPromos?: boolean }
  ): Promise<ProfilePayload> {
    this.cache = {
      ...this.cache,
      ...payload
    };
    await saveToJson("profile.json", this.cache);
    return loadFromJson<ProfilePayload>(this.cache);
  }

  async deleteAccount(): Promise<void> {
    // no-op for local mock
    return;
  }
}
