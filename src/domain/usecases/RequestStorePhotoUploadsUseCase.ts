import type { ThriftStoreId } from "../entities/ThriftStore";
import type { ThriftStoreRepository } from "../repositories/ThriftStoreRepository";
import type { PhotoUploadSlot } from "../../data/datasources/ThriftStoreRemoteDataSource";

export class RequestStorePhotoUploadsUseCase {
  constructor(private readonly repo: ThriftStoreRepository) {}

  execute(params: { storeId: ThriftStoreId; count: number; contentTypes: string[] }): Promise<PhotoUploadSlot[]> {
    return this.repo.requestPhotoUploads(params.storeId, {
      count: params.count,
      contentTypes: params.contentTypes
    });
  }
}
