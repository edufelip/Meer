import type { ThriftStoreRepository } from "../repositories/ThriftStoreRepository";
import type { ThriftStore, ThriftStoreId } from "../entities/ThriftStore";

export class CreateOrUpdateStoreUseCase {
  constructor(private readonly repository: ThriftStoreRepository) {}

  executeCreate(form: FormData): Promise<ThriftStore> {
    return this.repository.createStore(form);
  }

  executeUpdate(id: ThriftStoreId, form: FormData): Promise<ThriftStore> {
    return this.repository.updateStore(id, form);
  }
}
