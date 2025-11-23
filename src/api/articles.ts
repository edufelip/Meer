import { api } from "./client";
import type { ArticleDTO } from "./types";
import { endpoints } from "../network/endpoints";

export async function listArticlesByStore(storeId: string): Promise<ArticleDTO[]> {
  const res = await api.get<ArticleDTO[]>(endpoints.articles.listByStore(storeId));
  return res.data;
}

export async function getArticle(id: string): Promise<ArticleDTO> {
  const res = await api.get<ArticleDTO>(endpoints.articles.detail(id));
  return res.data;
}

export async function createArticle(storeId: string, payload: Partial<ArticleDTO>): Promise<ArticleDTO> {
  const res = await api.post<ArticleDTO>(endpoints.articles.create(storeId), payload);
  return res.data;
}

export async function updateArticle(id: string, payload: Partial<ArticleDTO>): Promise<ArticleDTO> {
  const res = await api.put<ArticleDTO>(endpoints.articles.update(id), payload);
  return res.data;
}

export async function deleteArticle(id: string): Promise<void> {
  await api.delete(endpoints.articles.delete(id));
}
