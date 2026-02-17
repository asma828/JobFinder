import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Favorite } from '../models/favorite.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private apiUrl = `${environment.jsonServerUrl}/favoritesOffers`;

  constructor(private http: HttpClient) {}

  /**
   * Get all favorites for a user
   */
  getFavorites(userId: number): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(`${this.apiUrl}?userId=${userId}`);
  }

  /**
   * Add a job to favorites
   */
  addFavorite(favorite: Favorite): Observable<Favorite> {
    const favoriteData = {
      ...favorite,
      dateAdded: new Date().toISOString()
    };
    return this.http.post<Favorite>(this.apiUrl, favoriteData);
  }

  /**
   * Remove a favorite by ID
   */
  removeFavorite(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Check if a job is already in favorites
   */
  isFavorite(userId: number, offerId: string): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(`${this.apiUrl}?userId=${userId}&offerId=${offerId}`);
  }

  /**
   * Get a favorite by offerId and userId
   */
  getFavoriteByOfferId(userId: number, offerId: string): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(`${this.apiUrl}?userId=${userId}&offerId=${offerId}`);
  }
}
