import { api } from "../../../api/client";
import type { User } from "../../../domain/entities/User";
import type { ProfileRemoteDataSource } from "../ProfileRemoteDataSource";

type ProfilePayload = User & { bio?: string; notifyNewStores: boolean; notifyPromos: boolean; ownedThriftStore?: any };

export class HttpProfileRemoteDataSource implements ProfileRemoteDataSource {
  async getProfile(): Promise<ProfilePayload> {
    const res = await api.get<ProfilePayload>("/profile");
    return res.data;
  }

  async updateProfile(
    payload: Partial<User> & { bio?: string; notifyNewStores?: boolean; notifyPromos?: boolean }
  ): Promise<ProfilePayload> {
    const res = await api.put<ProfilePayload>("/profile", payload);
    return res.data;
  }
}
