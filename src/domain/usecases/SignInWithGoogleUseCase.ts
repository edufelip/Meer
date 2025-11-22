import type { AuthUser } from "../entities/AuthUser";
import type { AuthRepository } from "../repositories/AuthRepository";

export class SignInWithGoogleUseCase {
  constructor(private readonly repository: AuthRepository) {}

  execute(idToken: string): Promise<AuthUser> {
    return this.repository.signInWithGoogleIdToken(idToken);
  }
}
