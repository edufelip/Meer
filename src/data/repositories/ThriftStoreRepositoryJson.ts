import type { ThriftStore, ThriftStoreId } from "../../domain/entities/ThriftStore";
import type { ThriftStoreRepository } from "../../domain/repositories/ThriftStoreRepository";
import type { ThriftStoreRemoteDataSource } from "../datasources/ThriftStoreRemoteDataSource";

export class ThriftStoreRepositoryJson implements ThriftStoreRepository {
  private readonly remote: ThriftStoreRemoteDataSource;

  constructor(remote: ThriftStoreRemoteDataSource) {
    this.remote = remote;
  }

  getFeatured(): Promise<ThriftStore[]> {
    return this.remote.getFeatured();
  }

  getNearby(): Promise<ThriftStore[]> {
    return this.remote.getNearby();
  }

  getFavorites(): Promise<ThriftStore[]> {
    return this.remote.getFavorites();
  }

  getById(id: ThriftStoreId): Promise<ThriftStore | null> {
    return this.remote.getById(id);
  }

  search(query: string): Promise<ThriftStore[]> {
    return this.remote.search(query);
  }

  listByCategory(params: {
    categoryId: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ items: ThriftStore[]; page: number; hasNext: boolean }> {
    return this.remote.listByCategory(params);
  }

  getHome(params?: { lat?: number; lng?: number }): Promise<{ featured: ThriftStore[]; nearby: ThriftStore[]; content: any[] }> {
    return this.remote.getHome(params);
  }

  listNearbyPaginated(params: {
    page?: number;
    pageSize?: number;
    lat?: number;
    lng?: number;
  }): Promise<{ items: ThriftStore[]; page: number; hasNext: boolean }> {
    return this.remote.listNearbyPaginated(params);
  }

  createStore(form: FormData): Promise<ThriftStore> {
    return this.remote.createStore(form);
  }

  updateStore(id: ThriftStoreId, form: FormData): Promise<ThriftStore> {
    return this.remote.updateStore(id, form);
  }
}
