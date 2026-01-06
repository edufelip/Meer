export interface ContentComment {
  id: string;
  body: string;
  userId: string;
  userDisplayName: string;
  userPhotoUrl?: string | null;
  createdAt: string;
  edited?: boolean;
}
