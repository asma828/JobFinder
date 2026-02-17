import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map, tap, of, throwError } from 'rxjs';
import { User, LoginCredentials, RegisterData } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Get user from localStorage or sessionStorage
   */
  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Save user to storage (localStorage for persistence)
   */
  private saveUserToStorage(user: User): void {
    const userToStore = { ...user };
    delete userToStore.password; // Never store password
    localStorage.setItem('currentUser', JSON.stringify(userToStore));
  }

  /**
   * Remove user from storage
   */
  private removeUserFromStorage(): void {
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
  }

  /**
   * Register a new user
   */
  register(data: RegisterData): Observable<User> {
    // First check if email already exists
    return this.http.get<User[]>(`${this.apiUrl}?email=${data.email}`).pipe(
      map(users => {
        if (users.length > 0) {
          throw new Error('Email already exists');
        }
        return data;
      }),
      // If email doesn't exist, create the user
      map(() => {
        const newUser: User = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password
        };
        return newUser;
      }),
      // Post to JSON Server
      tap(newUser => {
        this.http.post<User>(this.apiUrl, newUser).subscribe();
      })
    );
  }

  /**
   * Login user
   */
  login(credentials: LoginCredentials): Observable<User> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${credentials.email}&password=${credentials.password}`).pipe(
      map(users => {
        if (users.length === 0) {
          throw new Error('Invalid email or password');
        }
        const user = users[0];
        const userWithoutPassword = { ...user };
        delete userWithoutPassword.password;

        this.saveUserToStorage(userWithoutPassword);
        this.currentUserSubject.next(userWithoutPassword);

        return userWithoutPassword;
      })
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    this.removeUserFromStorage();
    this.currentUserSubject.next(null);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Get current user value
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Update user profile
   */
  updateUser(userId: number, userData: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${userId}`, userData).pipe(
      tap(updatedUser => {
        const userWithoutPassword = { ...updatedUser };
        delete userWithoutPassword.password;
        this.saveUserToStorage(userWithoutPassword);
        this.currentUserSubject.next(userWithoutPassword);
      })
    );
  }

  /**
   * Delete user account
   */
  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`).pipe(
      tap(() => {
        this.logout();
      })
    );
  }
}
