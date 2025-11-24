import type { User } from "../../domain/entities/User";

export interface ProfileLocalDataSource {
  getProfile(): Promise<(User & { bio?: string; notifyNewStores: boolean; notifyPromos: boolean; ownedThriftStore?: any }) | null>;
  saveProfile(profile: User & { bio?: string; notifyNewStores: boolean; notifyPromos: boolean; ownedThriftStore?: any }): Promise<void>;
  clearProfile(): Promise<void>;
}
