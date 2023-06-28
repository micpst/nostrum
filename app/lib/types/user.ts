export type User = {
  pubkey: string;
  name: string;
  displayName?: string;
  display_name?: string;
  about: string;
  picture: string;
  banner?: string;
  nip05?: string;
  verified: boolean;
};

export type EditableData = Extract<
  keyof User,
  "about" | "name" | "picture" | "banner" | "nip05"
>;

export type EditableUserData = Pick<User, EditableData>;
