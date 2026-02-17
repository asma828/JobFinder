import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { Favorite } from '../../core/models/favorite.model';
import { AuthService } from '../../core/services/auth.service';
import * as FavoritesActions from '../../store/favorites/favorites.actions';
import * as FavoritesSelectors from '../../store/favorites/favorites.selectors';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit {
  favorites$: Observable<Favorite[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  favoritesCount$: Observable<number>;

  constructor(
    private store: Store,
    private authService: AuthService
  ) {
    this.favorites$ = this.store.select(FavoritesSelectors.selectAllFavorites);
    this.loading$ = this.store.select(FavoritesSelectors.selectFavoritesLoading);
    this.error$ = this.store.select(FavoritesSelectors.selectFavoritesError);
    this.favoritesCount$ = this.store.select(FavoritesSelectors.selectFavoritesCount);
  }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.id) {
      // Dispatch action to load favorites
      this.store.dispatch(FavoritesActions.loadFavorites({ userId: currentUser.id }));
    }
  }

  removeFavorite(favorite: Favorite): void {
    if (favorite.id) {
      this.store.dispatch(FavoritesActions.removeFavorite({ id: favorite.id }));
    }
  }

  viewJob(url?: string): void {
    if (url) {
      window.open(url, '_blank');
    }
  }

  formatDate(dateString?: string): string {
    if (!dateString) {
      return 'Date non disponible';
    }

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Date non disponible';
    }
  }

  formatSalary(favorite: Favorite): string {
    if (favorite.salary_min && favorite.salary_max) {
      return `${favorite.salary_min.toLocaleString()} - ${favorite.salary_max.toLocaleString()} €`;
    } else if (favorite.salary_min) {
      return `À partir de ${favorite.salary_min.toLocaleString()} €`;
    } else if (favorite.salary_max) {
      return `Jusqu'à ${favorite.salary_max.toLocaleString()} €`;
    }
    return 'Non spécifié';
  }

  getApiSourceBadge(apiSource?: string): { color: string, text: string } {
    switch (apiSource) {
      case 'adzuna':
        return { color: 'primary', text: 'Adzuna' };
      case 'themuse':
        return { color: 'success', text: 'The Muse' };
      case 'remoteok':
        return { color: 'info', text: 'RemoteOK' };
      case 'jsearch':
        return { color: 'warning', text: 'JSearch' };
      default:
        return { color: 'secondary', text: 'Unknown' };
    }
  }
}
