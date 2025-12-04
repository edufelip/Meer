import type { ThriftStoreRepository } from "../repositories/ThriftStoreRepository";
import type { ThriftStore, ThriftStoreId } from "../entities/ThriftStore";
import type { CreateStorePayload } from "../../data/datasources/ThriftStoreRemoteDataSource";

export class CreateOrUpdateStoreUseCase {
  constructor(private readonly repository: ThriftStoreRepository) {}

  executeCreate(payload: CreateStorePayload): Promise<ThriftStore> {
    return this.repository.createStore(payload);
  }

  executeUpdate(id: ThriftStoreId, payload: Partial<CreateStorePayload>): Promise<ThriftStore> {
    return this.repository.updateStore(id, payload);
  }
}
