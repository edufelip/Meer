import type { ThriftStore, ThriftStoreId } from "../entities/ThriftStore";
import type { CreateStorePayload, PhotoUploadSlot } from "../../data/datasources/ThriftStoreRemoteDataSource";

export interface ThriftStoreRepository {
  getFeatured(params?: {
    lat?: number;
    lng?: number;
    forceRefresh?: boolean;
    onUpdated?: (data: ThriftStore[]) => void;
  }): Promise<ThriftStore[]>;
  getNearby(params?: {
    lat?: number;
    lng?: number;
    page?: number;
    pageSize?: number;
  }): Promise<{ items: ThriftStore[]; page: number; hasNext: boolean }>;
  getFavorites(): Promise<ThriftStore[]>;
  getById(id: ThriftStoreId): Promise<ThriftStore | null>;
  search(query: string): Promise<ThriftStore[]>;
  listByCategory(params: {
    categoryId: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ items: ThriftStore[]; page: number; hasNext: boolean }>;
  listNearbyPaginated(params: {
    page?: number;
    pageSize?: number;
    lat?: number;
    lng?: number;
  }): Promise<{ items: ThriftStore[]; page: number; hasNext: boolean }>;

  createStore(payload: CreateStorePayload): Promise<ThriftStore>;
  updateStore(id: ThriftStoreId, payload: Partial<CreateStorePayload>): Promise<ThriftStore>;
  requestPhotoUploads(storeId: ThriftStoreId, body: { count: number; contentTypes: string[] }): Promise<PhotoUploadSlot[]>;
  confirmPhotos(
    storeId: ThriftStoreId,
    photos: { fileKey?: string; photoId?: string; position: number }[],
    deletePhotoIds?: string[]
  ): Promise<ThriftStore>;
}
