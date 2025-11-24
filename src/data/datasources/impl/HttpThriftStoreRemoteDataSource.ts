import type { ThriftStore, ThriftStoreId } from "../../../domain/entities/ThriftStore";
import type { ThriftStoreRemoteDataSource } from "../ThriftStoreRemoteDataSource";
import { api } from "../../../api/client";

export class HttpThriftStoreRemoteDataSource implements ThriftStoreRemoteDataSource {
  async getFeatured(): Promise<ThriftStore[]> {
    const res = await api.get<ThriftStore[]>("/stores/featured");
    return res.data;
  }

  async getNearby(): Promise<ThriftStore[]> {
    const res = await api.get<ThriftStore[]>("/stores/nearby");
    return res.data;
  }

  async getFavorites(): Promise<ThriftStore[]> {
    const res = await api.get<ThriftStore[]>("/stores/favorites");
    return res.data;
  }

  async getById(id: ThriftStoreId): Promise<ThriftStore | null> {
    const res = await api.get<ThriftStore | null>(`/stores/${id}`);
    return res.data;
  }

  async search(query: string): Promise<ThriftStore[]> {
    const res = await api.get<ThriftStore[]>("/stores", { params: { q: query } });
    return res.data;
  }

  async listByCategory(params: {
    categoryId: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ items: ThriftStore[]; page: number; hasNext: boolean }> {
    const res = await api.get<{ items: ThriftStore[]; page: number; hasNext: boolean }>("/stores", {
      params: {
        categoryId: params.categoryId,
        page: params.page ?? 1,
        pageSize: params.pageSize ?? 10
      }
    });
    return res.data;
  }

  async getHome(params?: { lat?: number; lng?: number }): Promise<{ featured: ThriftStore[]; nearby: ThriftStore[]; content: any[] }> {
    const res = await api.get<{ featured: ThriftStore[]; nearby: ThriftStore[]; content: any[] }>("/home", {
      params: {
        lat: params?.lat,
        lng: params?.lng
      }
    });
    return res.data;
  }

  async listNearbyPaginated(params: {
    page?: number;
    pageSize?: number;
    lat?: number;
    lng?: number;
  }): Promise<{ items: ThriftStore[]; page: number; hasNext: boolean }> {
    const res = await api.get<{ items: ThriftStore[]; page: number; hasNext: boolean }>("/stores", {
      params: {
        type: "nearby",
        page: params.page ?? 1,
        pageSize: params.pageSize ?? 10,
        lat: params.lat,
        lng: params.lng
      }
    });
    return res.data;
  }
}
