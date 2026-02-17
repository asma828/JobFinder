import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of, take } from 'rxjs';

import { Job } from '../../../core/models/job.model';
import { Favorite } from '../../../core/models/favorite.model';
import { Application, ApplicationStatus } from '../../../core/models/application.model';

import { AuthService } from '../../../core/services/auth.service';
import { ApplicationsService } from '../../../core/services/applications.service';

import * as FavoritesActions from '../../../store/favorites/favorites.actions';
import * as FavoritesSelectors from '../../../store/favorites/favorites.selectors';

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './job-card.component.html',
  styleUrl: './job-card.component.css'
})
export class JobCardComponent implements OnInit {
  @Input() job!: Job;

  isAuthenticated = false;
  currentUserId: number | null = null;

  // ✅ ALWAYS defined
  isFavorite$!: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private applicationsService: ApplicationsService,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    const currentUser = this.authService.getCurrentUser();
    this.currentUserId = currentUser?.id || null;

    // ✅ Default value so button ALWAYS renders
    this.isFavorite$ = of(false);

    // ✅ Replace only if user is authenticated
    if (this.isAuthenticated && this.job?.id) {
      this.isFavorite$ = this.store.select(
        FavoritesSelectors.selectIsFavorite(this.job.id)
      );
    }
  }

  toggleFavorite(isFavorite: boolean): void {
    if (!this.isAuthenticated) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/jobs' }
      });
      return;
    }

    if (!this.currentUserId || !this.job?.id) {
      return;
    }

    if (isFavorite) {
      // ✅ Safe one-time subscription
      this.store
        .select(FavoritesSelectors.selectFavoriteByOfferId(this.job.id))
        .pipe(take(1))
        .subscribe(favorite => {
          if (favorite?.id) {
            this.store.dispatch(
              FavoritesActions.removeFavorite({ id: favorite.id })
            );
          }
        });
    } else {
      const favorite: Favorite = {
        userId: this.currentUserId,
        offerId: this.job.id,
        title: this.job.title,
        company: this.job.company,
        location: this.job.location,
        url: this.job.url,
        salary_min: this.job.salary_min,
        salary_max: this.job.salary_max,
        apiSource: this.job.apiSource
      };

      this.store.dispatch(
        FavoritesActions.addFavorite({ favorite })
      );
    }
  }

  addToApplications(): void {
    if (!this.isAuthenticated) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/jobs' }
      });
      return;
    }

    if (!this.currentUserId) return;

    const application: Application = {
      userId: this.currentUserId,
      offerId: this.job.id,
      apiSource: this.job.apiSource,
      title: this.job.title,
      company: this.job.company,
      location: this.job.location,
      url: this.job.url,
      status: ApplicationStatus.PENDING,
      notes: '',
      dateAdded: new Date().toISOString()
    };

    this.applicationsService.addApplication(application).subscribe();
  }

  viewJob(): void {
    if (this.job.url) {
      window.open(this.job.url, '_blank');
    }
  }

  getShortDescription(): string {
    if (!this.job.description) {
      return 'Aucune description disponible.';
    }

    const text = this.job.description.replace(/<[^>]*>/g, '');
    return text.length > 200 ? text.substring(0, 200) + '...' : text;
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'Date non disponible';

    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Date non disponible';
    }
  }

  formatSalary(): string {
    if (this.job.salary_min && this.job.salary_max) {
      return `${this.job.salary_min.toLocaleString()} - ${this.job.salary_max.toLocaleString()} €`;
    }
    if (this.job.salary_min) {
      return `À partir de ${this.job.salary_min.toLocaleString()} €`;
    }
    if (this.job.salary_max) {
      return `Jusqu'à ${this.job.salary_max.toLocaleString()} €`;
    }
    return 'Non spécifié';
  }

  getApiSourceBadge(): { color: string; text: string } {
    switch (this.job.apiSource) {
      case 'adzuna': return { color: 'primary', text: 'Adzuna' };
      case 'themuse': return { color: 'success', text: 'The Muse' };
      case 'remoteok': return { color: 'info', text: 'RemoteOK' };
      case 'jsearch': return { color: 'warning', text: 'JSearch' };
      default: return { color: 'secondary', text: 'Unknown' };
    }
  }
}
