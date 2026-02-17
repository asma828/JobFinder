import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Job, JobSearchParams } from '../models/job.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(private http: HttpClient) {}

  /**
   * Search jobs using Adzuna API
   */
  searchJobsAdzuna(params: JobSearchParams): Observable<{ results: Job[], count: number }> {
    const { appId, appKey, baseUrl } = environment.jobApis.adzuna;
    const country = 'us'; // Can be made dynamic
    const page = params.page || 1;
    const resultsPerPage = params.resultsPerPage || 10;

    // Build URL for Adzuna
    const url = `${baseUrl}/${country}/search/${page}`;

    let httpParams = new HttpParams()
      .set('app_id', appId)
      .set('app_key', appKey)
      .set('results_per_page', resultsPerPage.toString())
      .set('what', params.keyword)
      .set('where', params.location);

    return this.http.get<any>(url, { params: httpParams }).pipe(
      map(response => {
        const jobs: Job[] = response.results.map((job: any) => ({
          id: job.id,
          title: job.title,
          company: job.company.display_name,
          location: job.location.display_name,
          description: job.description,
          url: job.redirect_url,
          created: job.created,
          salary_min: job.salary_min,
          salary_max: job.salary_max,
          contract_type: job.contract_type,
          apiSource: 'adzuna'
        }));

        return {
          results: jobs,
          count: response.count
        };
      }),
      catchError(error => {
        console.error('Adzuna API Error:', error);
        return throwError(() => new Error('Failed to fetch jobs from Adzuna'));
      })
    );
  }

  /**
   * Search jobs using The Muse API
   */
  searchJobsTheMuse(params: JobSearchParams): Observable<{ results: Job[], count: number }> {
    const { baseUrl } = environment.jobApis.theMuseApi;
    const page = params.page || 0;
    const resultsPerPage = params.resultsPerPage || 10;

    let httpParams = new HttpParams()
      .set('page', page.toString())
      .set('descending', 'true')
      .set('page_size', resultsPerPage.toString());

    // The Muse uses 'category' for job title search
    if (params.keyword) {
      httpParams = httpParams.set('category', params.keyword);
    }

    if (params.location) {
      httpParams = httpParams.set('location', params.location);
    }

    return this.http.get<any>(baseUrl, { params: httpParams }).pipe(
      map(response => {
        const jobs: Job[] = response.results.map((job: any) => ({
          id: job.id.toString(),
          title: job.name,
          company: job.company.name,
          location: job.locations.map((loc: any) => loc.name).join(', ') || 'Remote',
          description: job.contents || 'No description available',
          url: job.refs.landing_page,
          created: job.publication_date,
          apiSource: 'themuse'
        }));

        return {
          results: jobs,
          count: response.page_count * resultsPerPage
        };
      }),
      catchError(error => {
        console.error('The Muse API Error:', error);
        return throwError(() => new Error('Failed to fetch jobs from The Muse'));
      })
    );
  }

  /**
   * Search jobs using RemoteOK API
   */
  searchJobsRemoteOK(params: JobSearchParams): Observable<{ results: Job[], count: number }> {
    const { baseUrl } = environment.jobApis.remoteOk;

    return this.http.get<any[]>(baseUrl).pipe(
      map(response => {
        // RemoteOK returns all jobs, we need to filter
        let jobs = response
          .filter(job => job.position) // Filter out non-job entries
          .map((job: any) => ({
            id: job.id || job.slug,
            title: job.position,
            company: job.company,
            location: job.location || 'Remote',
            description: job.description || 'No description available',
            url: job.url,
            created: job.date,
            salary_min: job.salary_min,
            salary_max: job.salary_max,
            apiSource: 'remoteok'
          }));

        // Filter by keyword (in title only as per requirements)
        if (params.keyword) {
          const keyword = params.keyword.toLowerCase();
          jobs = jobs.filter(job =>
            job.title.toLowerCase().includes(keyword)
          );
        }

        // Filter by location
        if (params.location) {
          const location = params.location.toLowerCase();
          jobs = jobs.filter(job =>
            job.location.toLowerCase().includes(location)
          );
        }

        // Sort by date (newest first)
        jobs.sort((a, b) => {
          const dateA = new Date(a.created || 0).getTime();
          const dateB = new Date(b.created || 0).getTime();
          return dateB - dateA;
        });

        // Pagination
        const page = params.page || 1;
        const resultsPerPage = params.resultsPerPage || 10;
        const startIndex = (page - 1) * resultsPerPage;
        const endIndex = startIndex + resultsPerPage;
        const paginatedJobs = jobs.slice(startIndex, endIndex);

        return {
          results: paginatedJobs,
          count: jobs.length
        };
      }),
      catchError(error => {
        console.error('RemoteOK API Error:', error);
        return throwError(() => new Error('Failed to fetch jobs from RemoteOK'));
      })
    );
  }

  /**
   * Search jobs using JSearch API (RapidAPI)
   */
  searchJobsJSearch(params: JobSearchParams): Observable<{ results: Job[], count: number }> {
    const { baseUrl, apiKey, apiHost } = environment.jobApis.jSearch;
    const page = params.page || 1;
    const resultsPerPage = params.resultsPerPage || 10;

    const headers = new HttpHeaders({
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': apiHost
    });

    let httpParams = new HttpParams()
      .set('query', `${params.keyword} in ${params.location}`)
      .set('page', page.toString())
      .set('num_pages', '1')
      .set('date_posted', 'all');

    return this.http.get<any>(`${baseUrl}/search`, { headers, params: httpParams }).pipe(
      map(response => {
        const jobs: Job[] = response.data.map((job: any) => ({
          id: job.job_id,
          title: job.job_title,
          company: job.employer_name,
          location: job.job_city || job.job_country || 'Remote',
          description: job.job_description,
          url: job.job_apply_link,
          created: job.job_posted_at_datetime_utc,
          salary_min: job.job_min_salary,
          salary_max: job.job_max_salary,
          contract_type: job.job_employment_type,
          apiSource: 'jsearch'
        }));

        return {
          results: jobs,
          count: response.total || jobs.length
        };
      }),
      catchError(error => {
        console.error('JSearch API Error:', error);
        return throwError(() => new Error('Failed to fetch jobs from JSearch'));
      })
    );
  }

  /**
   * Main search function - uses RemoteOK by default (no API key needed)
   * You can switch to other APIs by changing the method called
   */
  searchJobs(params: JobSearchParams): Observable<{ results: Job[], count: number }> {
    // Use RemoteOK as default since it doesn't require API keys
    return this.searchJobsRemoteOK(params);

    // Uncomment the one you want to use:
    // return this.searchJobsAdzuna(params);
    // return this.searchJobsTheMuse(params);
    // return this.searchJobsJSearch(params);
  }

  /**
   * Get a single job by ID (mock implementation)
   */
  getJobById(id: string): Observable<Job | null> {
    // This would require storing jobs or making individual API calls
    // For now, return null
    return of(null);
  }
}
