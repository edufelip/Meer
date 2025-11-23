import { api } from "./client";
import type { ThriftStoreDTO } from "./types";
import { endpoints } from "../network/endpoints";

export async function searchStores(query: string): Promise<ThriftStoreDTO[]> {
  const res = await api.get<ThriftStoreDTO[]>(endpoints.thriftStores.search(query));
  return res.data;
}

export async function listFeaturedStores(): Promise<ThriftStoreDTO[]> {
  const res = await api.get<ThriftStoreDTO[]>(endpoints.thriftStores.list());
  return res.data;
}

export async function getStore(id: string): Promise<ThriftStoreDTO> {
  const res = await api.get<ThriftStoreDTO>(endpoints.thriftStores.detail(id));
  return res.data;
}
