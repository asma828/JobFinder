import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { JobSearchComponent } from '../job-search/job-search.component';
import { JobCardComponent } from '../job-card/job-card.component';
import { JobService } from '../../../core/services/job.service';
import { Job, JobSearchParams } from '../../../core/models/job.model';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, NavbarComponent, JobSearchComponent, JobCardComponent],
  templateUrl: './job-list.component.html',
  styleUrl: './job-list.component.css'
})
export class JobListComponent implements OnInit {
  jobs: Job[] = [];
  isLoading = false;
  errorMessage = '';
  totalCount = 0;
  currentPage = 1;
  resultsPerPage = 10;
  totalPages = 0;
  hasSearched = false;

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    // Initially, no search is performed
  }

  onSearch(params: JobSearchParams): void {
    this.hasSearched = true;
    this.errorMessage = '';
    this.isLoading = true;
    this.currentPage = 1;

    const searchParams: JobSearchParams = {
      ...params,
      page: this.currentPage,
      resultsPerPage: this.resultsPerPage
    };

    this.jobService.searchJobs(searchParams).subscribe({
      next: (response) => {
        this.jobs = response.results;
        this.totalCount = response.count;
        this.totalPages = Math.ceil(this.totalCount / this.resultsPerPage);
        this.isLoading = false;

        if (this.jobs.length === 0) {
          this.errorMessage = 'Aucune offre trouvée pour votre recherche. Essayez avec d\'autres mots-clés.';
        }
      },
      error: (error) => {
        console.error('Search error:', error);
        this.errorMessage = 'Une erreur est survenue lors de la recherche. Veuillez réessayer.';
        this.isLoading = false;
        this.jobs = [];
      }
    });
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }

    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // We need to re-search with the new page
    // For this, we'd need to store the last search params
    // For now, we'll just scroll to top
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }
}
