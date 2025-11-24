import type { User } from "../entities/User";

export interface ProfileRepository {
  getProfile(): Promise<
    User & { bio?: string; notifyNewStores: boolean; notifyPromos: boolean; ownedThriftStore?: any }
  >;
  updateProfile(
    payload: Partial<User> & { bio?: string; notifyNewStores?: boolean; notifyPromos?: boolean }
  ): Promise<User & { bio?: string; notifyNewStores: boolean; notifyPromos: boolean; ownedThriftStore?: any }>;
  getCachedProfile(): Promise<
    (User & { bio?: string; notifyNewStores: boolean; notifyPromos: boolean; ownedThriftStore?: any }) | null
  >;
}
