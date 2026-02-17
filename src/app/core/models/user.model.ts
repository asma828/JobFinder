export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Only used for registration/login, not stored in session
}
