import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { Application, ApplicationStatus } from '../../core/models/application.model';
import { ApplicationsService } from '../../core/services/applications.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.css'
})
export class ApplicationsComponent implements OnInit {
  applications: Application[] = [];
  filteredApplications: Application[] = [];
  isLoading = false;
  errorMessage = '';
  selectedStatus: string = 'all';

  // Make enum accessible in template
  ApplicationStatus = ApplicationStatus;

  // Status options for filter
  statusOptions = [
    { value: 'all', label: 'Tous les statuts', icon: 'bi-list-ul' },
    { value: ApplicationStatus.PENDING, label: 'En attente', icon: 'bi-clock-fill', color: 'warning' },
    { value: ApplicationStatus.ACCEPTED, label: 'Accepté', icon: 'bi-check-circle-fill', color: 'success' },
    { value: ApplicationStatus.REJECTED, label: 'Refusé', icon: 'bi-x-circle-fill', color: 'danger' }
  ];

  constructor(
    private applicationsService: ApplicationsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.applicationsService.getApplications(currentUser.id).subscribe({
      next: (applications) => {
        this.applications = applications;
        this.filterApplications();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading applications:', error);
        this.errorMessage = 'Erreur lors du chargement des candidatures.';
        this.isLoading = false;
      }
    });
  }

  filterApplications(): void {
    if (this.selectedStatus === 'all') {
      this.filteredApplications = [...this.applications];
    } else {
      this.filteredApplications = this.applications.filter(
        app => app.status === this.selectedStatus
      );
    }
  }

  onStatusFilterChange(): void {
    this.filterApplications();
  }

  updateStatus(application: Application, newStatus: ApplicationStatus): void {
    if (!application.id) return;

    this.applicationsService.updateApplication(application.id, { status: newStatus }).subscribe({
      next: (updatedApp) => {
        // Update local array
        const index = this.applications.findIndex(app => app.id === application.id);
        if (index !== -1) {
          this.applications[index] = updatedApp;
          this.filterApplications();
        }
      },
      error: (error) => {
        console.error('Error updating status:', error);
        this.errorMessage = 'Erreur lors de la mise à jour du statut.';
      }
    });
  }

  updateNotes(application: Application, notes: string): void {
    if (!application.id) return;

    this.applicationsService.updateApplication(application.id, { notes }).subscribe({
      next: (updatedApp) => {
        const index = this.applications.findIndex(app => app.id === application.id);
        if (index !== -1) {
          this.applications[index] = updatedApp;
        }
      },
      error: (error) => {
        console.error('Error updating notes:', error);
        this.errorMessage = 'Erreur lors de la mise à jour des notes.';
      }
    });
  }

  deleteApplication(application: Application): void {
    if (!application.id) return;

    if (!confirm('Êtes-vous sûr de vouloir supprimer cette candidature ?')) {
      return;
    }

    this.applicationsService.deleteApplication(application.id).subscribe({
      next: () => {
        this.applications = this.applications.filter(app => app.id !== application.id);
        this.filterApplications();
      },
      error: (error) => {
        console.error('Error deleting application:', error);
        this.errorMessage = 'Erreur lors de la suppression de la candidature.';
      }
    });
  }

  viewJob(url: string): void {
    window.open(url, '_blank');
  }

  formatDate(dateString: string): string {
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

  getStatusBadge(status: ApplicationStatus): { color: string, label: string, icon: string } {
    switch (status) {
      case ApplicationStatus.PENDING:
        return { color: 'warning', label: 'En attente', icon: 'bi-clock-fill' };
      case ApplicationStatus.ACCEPTED:
        return { color: 'success', label: 'Accepté', icon: 'bi-check-circle-fill' };
      case ApplicationStatus.REJECTED:
        return { color: 'danger', label: 'Refusé', icon: 'bi-x-circle-fill' };
      default:
        return { color: 'secondary', label: 'Inconnu', icon: 'bi-question-circle-fill' };
    }
  }

  getStatusCount(status: string): number {
    if (status === 'all') {
      return this.applications.length;
    }
    return this.applications.filter(app => app.status === status).length;
  }
}
