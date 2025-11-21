import type { User } from "../../domain/entities/User";

export interface ProfileRemoteDataSource {
  getProfile(): Promise<User & { bio?: string; notifyNewStores: boolean; notifyPromos: boolean }>;
  updateProfile(
    payload: Partial<User> & { bio?: string; notifyNewStores?: boolean; notifyPromos?: boolean }
  ): Promise<User & { bio?: string; notifyNewStores: boolean; notifyPromos: boolean }>;
}
