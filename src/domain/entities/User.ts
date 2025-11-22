export type UserId = string;

export interface User {
  id: UserId;
  name: string;
  avatarUrl?: string;
  email: string;
  ownedThriftStore?: import("./ThriftStore").ThriftStore | null;
}
