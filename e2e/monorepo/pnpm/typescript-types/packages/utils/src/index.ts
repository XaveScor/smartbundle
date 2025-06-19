export interface User {
  id: number;
  name: string;
  email: string;
}

export function createUser(name: string, email: string): User {
  return {
    id: Math.floor(Math.random() * 1000000),
    name,
    email
  };
}

export const VERSION = "1.0.0" as const;