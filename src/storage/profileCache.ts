import { AsyncStorageProfileLocalDataSource } from "../data/datasources/impl/AsyncStorageProfileLocalDataSource";
import type { User } from "../domain/entities/User";

const profileLocal = new AsyncStorageProfileLocalDataSource();

type MinimalProfile = User & {
  bio?: string;
  notifyNewStores?: boolean;
  notifyPromos?: boolean;
  ownedThriftStore?: any;
};

export async function cacheProfile(profile: MinimalProfile) {
  const existing = await profileLocal.getProfile();

  // Fill safe defaults for optional flags to avoid undefined in UI.
  const normalized: MinimalProfile = {
    ...profile,
    id: profile.id ? String(profile.id) : profile.id,
    notifyNewStores: profile.notifyNewStores ?? false,
    notifyPromos: profile.notifyPromos ?? false
  };

  // Merge with previously cached profile so we don't lose data (e.g., ownedThriftStore)
  // when a partial payload is cached (like during login bootstrap).
  const merged: MinimalProfile = {
    ...(existing ?? {}),
    ...normalized
  };

  // Preserve existing fields when the new payload omits them (undefined), but allow
  // explicit null from the server to clear them.
  if (normalized.ownedThriftStore === undefined) {
    merged.ownedThriftStore = existing?.ownedThriftStore;
  }
  if (normalized.bio === undefined) {
    merged.bio = existing?.bio;
  }

  await profileLocal.saveProfile(merged as any);
}
