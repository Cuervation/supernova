export type AuthUser = {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL?: string | null;
  provider?: string;
};

export type Unsubscribe = () => void;
