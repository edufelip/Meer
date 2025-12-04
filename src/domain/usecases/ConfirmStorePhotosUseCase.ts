import type { ThriftStoreId, ThriftStore } from "../entities/ThriftStore";
import type { ThriftStoreRepository } from "../repositories/ThriftStoreRepository";

export class ConfirmStorePhotosUseCase {
  constructor(private readonly repo: ThriftStoreRepository) {}

  execute(params: {
    storeId: ThriftStoreId;
    photos: { fileKey?: string; photoId?: string; position: number }[];
    deletePhotoIds?: string[];
  }): Promise<ThriftStore> {
    return this.repo.confirmPhotos(params.storeId, params.photos, params.deletePhotoIds);
  }
}
