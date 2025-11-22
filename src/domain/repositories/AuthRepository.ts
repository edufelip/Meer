import type { AuthUser } from "../entities/AuthUser";

export interface AuthRepository {
  signInWithEmail(email: string, password: string): Promise<AuthUser>;
  signUpWithEmail(email: string, password: string, displayName?: string): Promise<AuthUser>;
  signInWithGoogleIdToken(idToken: string): Promise<AuthUser>;
}
