import type { AuthUser } from "../entities/AuthUser";
import type { AuthRepository } from "../repositories/AuthRepository";

export class SignInWithEmailUseCase {
  constructor(private readonly repository: AuthRepository) {}

  execute(email: string, password: string): Promise<AuthUser> {
    return this.repository.signInWithEmail(email, password);
  }
}
