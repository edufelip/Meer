export interface ThriftStoreDTO {
  id: string;
  name: string;
  description?: string;
  addressLine?: string;
  neighborhood?: string;
  imageUrl?: string;
  coverImageUrl?: string;
  categories?: string[];
  distanceKm?: number;
}

export interface ArticleDTO {
  id: string;
  storeId: string;
  title: string;
  description?: string;
  categoryLabel?: string;
  imageUrl?: string;
  mediaUrls?: string[];
}
