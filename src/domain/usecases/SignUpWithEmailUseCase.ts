import type { AuthUser } from "../entities/AuthUser";
import type { AuthRepository } from "../repositories/AuthRepository";

export class SignUpWithEmailUseCase {
  constructor(private readonly repository: AuthRepository) {}

  execute(email: string, password: string, displayName?: string): Promise<AuthUser> {
    return this.repository.signUpWithEmail(email, password, displayName);
  }
}
