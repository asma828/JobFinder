export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Only used for registration/login, not stored in session
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
