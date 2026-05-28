export type AuthenticatedUser = {
  uid: string;
  email?: string;
  displayName?: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export {};
