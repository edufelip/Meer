export type AuthUserId = string;

export interface AuthUser {
  id: AuthUserId;
  email?: string | null;
  displayName?: string | null;
  photoUrl?: string | null;
}
