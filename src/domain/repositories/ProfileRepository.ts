import type { User } from "../entities/User";

export interface ProfileRepository {
  getProfile(): Promise<User & { bio?: string; notifyNewStores: boolean; notifyPromos: boolean }>;
  updateProfile(
    payload: Partial<User> & { bio?: string; notifyNewStores?: boolean; notifyPromos?: boolean }
  ): Promise<User & { bio?: string; notifyNewStores: boolean; notifyPromos: boolean }>;
}
