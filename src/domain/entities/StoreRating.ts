export interface StoreRating {
  id: string;
  storeId: string;
  score: number;
  body: string;
  authorName?: string;
  authorAvatarUrl?: string;
  createdAt?: string;
}
