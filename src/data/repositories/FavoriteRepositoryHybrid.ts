import type { FavoriteRepository } from "../../domain/repositories/FavoriteRepository";
import type { ThriftStore, ThriftStoreId } from "../../domain/entities/ThriftStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { FavoriteRemoteDataSource } from "../datasources/FavoriteRemoteDataSource";

const STORAGE_KEY = "favorites";
const QUEUE_KEY = "favorites_queue";

type FavoriteOp = {
  id: string;
  type: "favorite_add" | "favorite_remove";
  storeId: ThriftStoreId;
  createdAt: number;
};

async function readAll(): Promise<ThriftStore[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as ThriftStore[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeAll(stores: ThriftStore[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stores));
}

async function readQueue(): Promise<FavoriteOp[]> {
  const raw = await AsyncStorage.getItem(QUEUE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as FavoriteOp[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeQueue(queue: FavoriteOp[]): Promise<void> {
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

const uuid = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

/**
 * Hybrid favorite repository: optimistic local update, then sync remote.
 * If remote fails, local state stays but we log; next refresh will correct.
 */
export class FavoriteRepositoryHybrid implements FavoriteRepository {
  constructor(private readonly remote: FavoriteRemoteDataSource) {}

  private processing = false;

  async getAll(): Promise<ThriftStore[]> {
    try {
      const remote = await this.remote.list();
      await writeAll(remote);
      return remote;
    } catch {
      // fallback to cache
      return readAll();
    }
  }

  async isFavorite(id: ThriftStoreId): Promise<boolean> {
    const cached = await readAll();
    return cached.some((s) => s.id === id);
  }

  async toggle(store: ThriftStore): Promise<boolean> {
    const cached = await readAll();
    const exists = cached.findIndex((s) => s.id === store.id);
    let newState: ThriftStore[];
    let nowFavorite: boolean;

    if (exists >= 0) {
      cached.splice(exists, 1);
      newState = [...cached];
      nowFavorite = false;
      writeAll(newState); // optimistic
      await this.enqueue({ type: "favorite_remove", storeId: store.id });
      this.processQueue().catch(() => {});
    } else {
      newState = [...cached, store];
      nowFavorite = true;
      writeAll(newState); // optimistic
      await this.enqueue({ type: "favorite_add", storeId: store.id });
      this.processQueue().catch(() => {});
    }

    return nowFavorite;
  }

  async syncPending(): Promise<void> {
    await this.processQueue();
  }

  private async enqueue(op: { type: "favorite_add" | "favorite_remove"; storeId: ThriftStoreId }) {
    const queue = await readQueue();
    queue.push({ id: uuid(), type: op.type, storeId: op.storeId, createdAt: Date.now() });
    await writeQueue(queue);
  }

  private async processQueue(): Promise<void> {
    if (this.processing) return;
    this.processing = true;
    try {
      let queue = await readQueue();
      while (queue.length > 0) {
        const [next, ...rest] = queue;
        try {
          if (next.type === "favorite_add") {
            await this.remote.add(next.storeId);
          } else {
            await this.remote.remove(next.storeId);
          }
          queue = rest;
          await writeQueue(queue);
        } catch {
          // stop on first failure; will retry later (e.g., app foreground)
          break;
        }
      }
    } finally {
      this.processing = false;
    }
  }
}
