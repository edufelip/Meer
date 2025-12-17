import * as Linking from "expo-linking";
import type { ThriftStoreId } from "../domain/entities/ThriftStore";

function normalizeBaseUrl(raw: string): string | null {
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return raw.replace(/\/$/, "");
  } catch {
    return null;
  }
}

export function getWebBaseUrl(): string | null {
  const raw = process.env.EXPO_PUBLIC_WEB_BASE_URL;
  if (!raw) return null;
  return normalizeBaseUrl(raw);
}

export function buildThriftStorePath(id: ThriftStoreId): string {
  return `store/${encodeURIComponent(id)}`;
}

export function buildThriftStoreShareUrl(id: ThriftStoreId): string {
  const baseUrl = getWebBaseUrl();
  const path = buildThriftStorePath(id);

  if (baseUrl) {
    return `${baseUrl}/${path}`;
  }

  return Linking.createURL(path);
}

